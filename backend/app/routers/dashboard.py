from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from ..db import get_session
from ..models import User, Child, Assessment
from ..schemas import DashboardSummary
from ..auth import get_current_user_email

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def summary(email: str = Depends(get_current_user_email), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        return DashboardSummary(total_assessments=0, average_risk=None)
    child_ids = session.exec(select(Child.id).where(Child.parent_id == user.id)).all()
    if not child_ids:
        return DashboardSummary(total_assessments=0, average_risk=None)
    total = session.exec(select(func.count(Assessment.id)).where(Assessment.child_id.in_(child_ids))).one()
    avg = session.exec(select(func.avg(Assessment.risk_score)).where(Assessment.child_id.in_(child_ids))).one()
    total_assessments = int(total) if total is not None else 0
    average_risk = float(avg) if avg is not None else None
    return DashboardSummary(total_assessments=total_assessments, average_risk=average_risk)