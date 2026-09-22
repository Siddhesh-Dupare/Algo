from pydantic import BaseModel


class Steps(BaseModel):
    step_id: int
    description: str
    action: str
    explanation: str


class Root(BaseModel):
    code_language: str
    algorithm: str
    description: str
    total_steps: int
    steps: list[Steps]
