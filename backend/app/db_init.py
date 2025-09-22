#!/usr/bin/env python3
"""Initialize database with sample data for testing"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from app.db import engine, init_db
from app.models import User, Child
from app.auth import hash_password

def seed_data():
    """Create sample users and children for demo"""
    init_db()
    
    with Session(engine) as session:
        # Check if demo user exists
        existing = session.exec(select(User).where(User.email == "demo@binakata.id")).first()
        if existing:
            print("Demo data already exists")
            return
        
        # Create demo user
        demo_user = User(
            email="demo@binakata.id",
            password_hash=hash_password("Demo123!")
        )
        session.add(demo_user)
        session.commit()
        session.refresh(demo_user)
        
        # Create sample children
        child1 = Child(parent_id=demo_user.id, name="Rizki", age=9)
        child2 = Child(parent_id=demo_user.id, name="Siti", age=7)
        session.add(child1)
        session.add(child2)
        session.commit()
        
        print(f"Created demo user: demo@binakata.id (password: Demo123!)")
        print(f"Created 2 children profiles")

if __name__ == "__main__":
    seed_data()