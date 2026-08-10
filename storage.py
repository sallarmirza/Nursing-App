from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from db_model import Base
import os

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")


class DBManager:

    def __init__(self):
        self.engine = create_engine(
            DB_URL,
            connect_args={"check_same_thread": False}
        )

        self.SessionLocal = sessionmaker(
            autoflush=False,
            autocommit=False,
            bind=self.engine
        )

    def initialize_db(self):
        Base.metadata.create_all(bind=self.engine)

    def get_session(self):
        return self.SessionLocal()

    def get_db(self):
        db = self.SessionLocal()

        try:
            yield db
        finally:
            db.close()

    def close(self):
        self.engine.dispose()