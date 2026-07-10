import bdb
import json
import os
import sys

MAX_STEPS = 2000
MAX_REPR_LEN = 200
MAX_DEPTH = 2
MAX_ITEMS = 20

# The traced script's own stdout (print statements) shares this same stream.
# Plain output that happens to look like valid JSON (a bare number, "string",
# true/false/null) would otherwise be indistinguishable from a real trace
# event, so every line this tracer emits is prefixed with a sentinel the
# traced program could never produce by accident.
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

    def is_target_frame(self, frame):
        return os.path.abspath(frame.f_code.co_filename) == self.target_file

    def safe_repr(self, value, depth=0):
        try:
            if depth >= MAX_DEPTH:
                r = f"<{type(value).__name__}>"
            elif isinstance(value, (int, float, bool, str, type(None))):
                r = repr(value)
            elif isinstance(value, (list, tuple, set)):
                opener, closer = {
                    "list": ("[", "]"),
                    "tuple": ("(", ")"),
                    "set": ("{", "}"),
                }[type(value).__name__]
                items = list(value)[:MAX_ITEMS]
                inner = ", ".join(self.safe_repr(v, depth + 1) for v in items)
                if len(value) > MAX_ITEMS:
                    inner += ", ..."
                r = opener + inner + closer
            elif isinstance(value, dict):
                items = list(value.items())[:MAX_ITEMS]
                inner = ", ".join(
                    f"{self.safe_repr(k, depth + 1)}: {self.safe_repr(v, depth + 1)}"
                    for k, v in items
                )
                suffix = ", ...}" if len(value) > MAX_ITEMS else "}"
                r = "{" + inner + suffix
            else:
                r = repr(value)
        except Exception:
            r = "<unrepr-able>"
        return r[:MAX_REPR_LEN]

    def locals_snapshot(self, frame):
        return {
            k: self.safe_repr(v)
            for k, v in frame.f_locals.items()
            if not k.startswith("__")
        }

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
    target = sys.argv[1]
    with open(target, "r", encoding="utf-8") as f:
        source = f.read()

    tracer = Tracer(target)
    tracer.set_step()
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


if __name__ == "__main__":
    main()
