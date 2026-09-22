from groq import BadRequestError, RateLimitError

from src.ai.prompt import SYSTEM_PROMPT
from src.config import client


def generate_response(user_input: str) -> str:
    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": user_input,
                },
            ],
            temperature=0.6,
            max_completion_tokens=2048,
            top_p=0.95,
            reasoning_effort="default",
            stream=False,
            stop=None,
        )

        return response.choices[0].message.content or ""

    except RateLimitError:
        raise RuntimeError("[Error]: Rate limit exceeded")
    except BadRequestError as e:
        raise RuntimeError(f"[Error]: Bad request {e}")
    except Exception as e:
        raise ValueError(f"[Error]: Exception {e}")
