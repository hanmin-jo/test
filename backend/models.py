from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship, Mapped

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    email: Mapped[str] = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = Column(String(255), nullable=False)
    name: Mapped[str] = Column(String(100), nullable=False)
    is_active: Mapped[bool] = Column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    notes: Mapped[list["Note"]] = relationship(
        "Note",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    study_records: Mapped[list["StudyRecord"]] = relationship(
        "StudyRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = Column(String(255), nullable=False)
    content: Mapped[str] = Column(Text, nullable=False)
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="notes")
    quizzes: Mapped[list["Quiz"]] = relationship(
        "Quiz",
        back_populates="note",
        cascade="all, delete-orphan",
    )


class Quiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    note_id: Mapped[int] = Column(
        Integer, ForeignKey("notes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    question: Mapped[str] = Column(Text, nullable=False)
    answer: Mapped[str] = Column(Text, nullable=False)
    # JSON 문자열로 4개의 객관식 보기를 저장 (예: '["A", "B", "C", "D"]')
    choices_json: Mapped[str] = Column(Text, nullable=False)
    # 정답에 대한 해설
    explanation: Mapped[str] = Column(Text, nullable=False)
    created_at: Mapped[datetime] = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    note: Mapped["Note"] = relationship("Note", back_populates="quizzes")
    study_records: Mapped[list["StudyRecord"]] = relationship(
        "StudyRecord",
        back_populates="quiz",
        cascade="all, delete-orphan",
    )


class StudyRecord(Base):
    __tablename__ = "study_records"

    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    quiz_id: Mapped[int] = Column(
        Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False
    )
    is_correct: Mapped[bool] = Column(Boolean, default=False, nullable=False)
    studied_at: Mapped[datetime] = Column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="study_records")
    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="study_records")

