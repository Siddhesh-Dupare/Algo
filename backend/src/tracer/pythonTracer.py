import sys
import bdb
import os
import json

MAX_DEPTH = 2
MAX_ITEMS = 20
MAX_REPR_LEN = 200
MAX_STEPS = 2000

PREFIX = "__ALGOLENS_TRACE__"

def emit_json(obj):
    print(PREFIX + json.dumps(obj), flush=True)

class StepLimitExceeded(Exception):
    pass

class Tracer(bdb.Bdb):
    def __init__(self, target_file):
        super().__init__()
        self.target_file = os.path.abspath(target_file)
        self.step_count = 0

    # NOTE: Ignore the built in files of python
    def is_target_frame(self, frame):
        return os.path.abspath(frame.f_code.co_filename) == self.target_file

    # NOTE: The conversion of code into tokens
    def safe_repr(self, value, depth=0):
        try:
            #  NOTE: Recursively limit the depth to avoid infinite recursion
            if depth >= MAX_DEPTH:
                r = f"<{type(value).__name__}>"
            # NOTE: Identify the type of the value and return its repr
            elif isinstance(value, (int, float, bool, str, type(None))):
                r = repr(value)
            # NOTE: Identify the data structures from the target file
            elif isinstance(value, (tuple, list, set)):
                # NOTE: Opening and closing brackets for the data structure
                opener, closer = {
                    "tuple": ("(", ")"),
                    "list": ("[", "]"),
                    "set": ("{", "}"),
                }[type(value).__name__]
                items = list(value)[:MAX_ITEMS]
                inner = ", ".join(self.safe_repr(v, depth + 1) for v in items)
                if len(value) > MAX_ITEMS:
                    inner += ", ..."
                r = opener + inner + closer
            # NOTE: Identify the dictionary type and return its repr
            elif isinstance(value, dict):
                items = list(value.items())[:MAX_ITEMS]
                inner = ", ".join(
                    f"{self.safe_repr(k, depth + 1)}: {self.safe_repr(v, depth + 1)}"
                    for k, v in items
                )
                suffix = ", ...}" if len(value) > MAX_ITEMS else "}"
                r = "{" + inner + suffix
            # NOTE: If none found, then consider it as a standard object
            else:
                r = repr(value)
        # NOTE: If the repr fails, return a generic message
        except Exception:
            r = "<unrepr-able>"
        return r[:MAX_REPR_LEN]

    # NOTE: Capture a snapshot of the local variables in the given frame
    # NOTE: Ignoring variables starting with "__"
    def locals_snapshot(self, frame):
        return {
            k: self.safe_repr(v)
            for k, v in frame.f_locals.items()
            if not k.startswith("__")
        }

    # NOTE: Generate a summary of the call stack for the given frame
    def call_stack_summary(self, frame):
        stack = []
        f = frame
        while f is not None and self.is_target_frame(f):
            stack.append({"function": f.f_code.co_name, "line": f.f_lineno})
            f = f.f_back
        stack.reverse()
        return stack

    def emit(self, event, frame):
        if not self.is_target_frame(frame):
            return
        self.step_count += 1
        # NOTE: Raise an exception if the step count exceed the limit
        if self.step_count > MAX_STEPS:
            raise StepLimitExceeded()
        step = {
            "event": event,
            "line": frame.f_lineno,
            "function": frame.f_code.co_name,
            "locals": self.locals_snapshot(frame),
            "stack": self.call_stack_summary(frame),
        }
        emit_json(step)

    def user_call(self, frame, argument_list):
        self.emit("call", frame)

    def user_line(self, frame):
        self.emit("line", frame)

    def user_return(self, frame, return_value):
        is_target = self.is_target_frame(frame)
        self.emit("return", frame)
        if is_target:
            emit_json({"event": "return_value", "value": self.safe_repr(return_value)})

    def user_exception(self, frame, exc_info):
        exc_type, exc_value, _ = exc_info
        self.emit("exception", frame)
        emit_json(
            {
                "event": "exception_detail",
                "type": exc_type.__name__,
                "message": str(exc_value),
            }
        )

def main():
    # NOTE: Capture the paht of the current file you want to debug
    target = sys.argv[1]

    # NOTE: Open and red the contents of the target file
    with open(target, "r", encoding="utf-8") as f:
        source = f.read()

    tracer = Tracer(target)
    tracer.set_step()

    # NOTE: Compile the source code into bytecode
    code = compile(source, target, "exec")
    globals_dict = {"__name__": "__main__", "__file__": target}

    try:
        tracer.run(code, globals_dict, globals_dict)
        emit_json({"event": "complete"})
    except StepLimitExceeded:
        emit_json(
            {"event": "error", "message": f"Step limit ({MAX_STEPS}) exceeded — possible infinite loop"}
        )
    except SystemExit:
        emit_json({"event": "complete"})
    except Exception as e:
        emit_json({"event": "error", "message": f"{type(e).__name__}: {e}"})

# NOTE: Execution Entry Point
if __name__ == "__main__":
    main()
