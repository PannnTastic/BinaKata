from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    children: List["Child"] = Relationship(back_populates="parent")

class Child(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: int = Field(foreign_key="user.id")
    name: str
    age: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    parent: Optional[User] = Relationship(back_populates="children")
    assessments: List["Assessment"] = Relationship(back_populates="child")

class Assessment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    child_id: int = Field(foreign_key="child.id")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    submitted_at: Optional[datetime] = None
    risk_score: Optional[float] = None
    recommendation: Optional[str] = None
    child: Optional[Child] = Relationship(back_populates="assessments")
    items: List["AssessmentItem"] = Relationship(back_populates="assessment")

class AssessmentItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assessment_id: int = Field(foreign_key="assessment.id")
    item_type: str  # letter|word|arrange
    prompt: str
    answer: Optional[str] = None
    is_correct: Optional[bool] = None
    position: int = 0
    assessment: Optional[Assessment] = Relationship(back_populates="items")