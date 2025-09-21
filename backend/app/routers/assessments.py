from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..db import get_session
from ..models import User, Child, Assessment, AssessmentItem
from ..schemas import AssessmentStart, AssessmentSubmit, AssessmentOut
from ..auth import get_current_user_email
from ..ml.model import predict_score

router = APIRouter(prefix="/assessments", tags=["assessments"])

LETTER_ITEMS = [
    ("A", True), ("B", True), ("D", True), ("P", True)
]
WORD_ITEMS = [
    ("Paku", True), ("Baku", True), ("Kuda", True), ("Buku", True)
]
ARRANGE_ITEMS = [
    ("K U C I N G", "KUCING"),
]

@router.post("/start")
def start_assessment(payload: AssessmentStart, email: str = Depends(get_current_user_email), session: Session = Depends(get_session)):
    # validate child belongs to user
    user = session.exec(select(User).where(User.email == email)).first()
    child = session.get(Child, payload.child_id)
    if not child or child.parent_id != user.id:
        raise HTTPException(status_code=404, detail="Child not found")
    assessment = Assessment(child_id=child.id)
    session.add(assessment)
    session.commit()
    session.refresh(assessment)

    # seed items
    pos = 0
    for txt, _ in LETTER_ITEMS:
        session.add(AssessmentItem(assessment_id=assessment.id, item_type="letter", prompt=txt, position=pos)); pos += 1
    for txt, _ in WORD_ITEMS:
        session.add(AssessmentItem(assessment_id=assessment.id, item_type="word", prompt=txt, position=pos)); pos += 1
    for txt, target in ARRANGE_ITEMS:
        session.add(AssessmentItem(assessment_id=assessment.id, item_type="arrange", prompt=f"{txt} -> {target}", position=pos)); pos += 1
    session.commit()
    return {"assessment_id": assessment.id}

@router.post("/submit", response_model=AssessmentOut)
def submit_assessment(payload: AssessmentSubmit, email: str = Depends(get_current_user_email), session: Session = Depends(get_session)):
    assessment = session.get(Assessment, payload.assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    # Map answers
    items = session.exec(select(AssessmentItem).where(AssessmentItem.assessment_id == assessment.id)).all()
    # Sort items by position to allow sequential mapping when client doesn't know DB IDs
    items_sorted = sorted(items, key=lambda x: x.position)
    id2item = {i.id: i for i in items}

    correct_letters = 0
    total_letters = 0
    correct_words = 0
    total_words = 0
    correct_arrange = 0
    total_arrange = 0

    for idx, ans in enumerate(payload.answers):
        item = id2item.get(ans.id)
        if not item:
            # Fallback: map by order
            if idx < len(items_sorted):
                item = items_sorted[idx]
            else:
                continue
        item.answer = ans.answer
        if item.item_type == "letter":
            total_letters += 1
            item.is_correct = (ans.answer.strip().upper() == item.prompt.strip().upper())
            if item.is_correct:
                correct_letters += 1
        elif item.item_type == "word":
            total_words += 1
            item.is_correct = (ans.answer.strip().lower() == item.prompt.strip().lower())
            if item.is_correct:
                correct_words += 1
        else:  # arrange
            total_arrange += 1
            # prompt format: "K U C I N G -> KUCING"
            target = item.prompt.split("->")[-1].strip()
            item.is_correct = (ans.answer.replace(" ", "").upper() == target.upper())
            if item.is_correct:
                correct_arrange += 1
    session.commit()

    letters_acc = (correct_letters / total_letters) if total_letters else 0.0
    words_acc = (correct_words / total_words) if total_words else 0.0
    arrange_acc = (correct_arrange / total_arrange) if total_arrange else 0.0

    risk, rec = predict_score(letters_acc, words_acc, arrange_acc)

    assessment.submitted_at = datetime.utcnow()
    assessment.risk_score = risk
    assessment.recommendation = rec
    session.add(assessment)
    session.commit()

    return AssessmentOut(id=assessment.id, risk_score=risk, recommendation=rec)