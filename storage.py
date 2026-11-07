from contextlib import contextmanager
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

    @contextmanager
    def get_session(self):
        # Yields a session that auto-rollbacks on exception and always closes.
        session = self.SessionLocal()
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def close(self):
        self.engine.dispose()


# Single shared instance. Import this everywhere instead of calling DBManager().
db = DBManager()