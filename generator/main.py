from code_exp import code_example
from src.ai.response import generate_response

if __name__ == "__main__":
    result = generate_response(code_example)

    print(result)
