from pydantic import BaseModel
from typing import List, Optional

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChildCreate(BaseModel):
    name: str
    age: Optional[int] = None

class ChildOut(BaseModel):
    id: int
    name: str
    age: Optional[int]

    class Config:
        from_attributes = True

class AssessmentStart(BaseModel):
    child_id: int

class AssessmentItemAnswer(BaseModel):
    id: int
    answer: str

class AssessmentSubmit(BaseModel):
    assessment_id: int
    answers: List[AssessmentItemAnswer]

class AssessmentOut(BaseModel):
    id: int
    risk_score: float
    recommendation: str

class DashboardSummary(BaseModel):
    total_assessments: int
    average_risk: Optional[float]