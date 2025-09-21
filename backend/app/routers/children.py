from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..db import get_session
from ..models import User, Child
from ..schemas import ChildCreate, ChildOut
from ..auth import get_current_user_email

router = APIRouter(prefix="/children", tags=["children"])

@router.get("/", response_model=list[ChildOut])
def list_children(email: str = Depends(get_current_user_email), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        return []
    children = session.exec(select(Child).where(Child.parent_id == user.id)).all()
    return children

@router.post("/", response_model=ChildOut)
def create_child(payload: ChildCreate, email: str = Depends(get_current_user_email), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == email)).first()
    child = Child(parent_id=user.id, name=payload.name, age=payload.age)
    session.add(child)
    session.commit()
    session.refresh(child)
    return child