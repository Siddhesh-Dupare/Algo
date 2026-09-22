from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
import src.ai.response as response_module
from src.ai.response import generate_response


def make_response(content):
    return SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=content))]
    )


def test_generate_response(monkeypatch):
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = make_response(
        "Hello from the model"
    )

    monkeypatch.setattr(response_module, "client", mock_client)

    result = generate_response("Say Hello")

    assert result == "Hello from the model"
