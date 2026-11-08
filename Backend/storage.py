from contextlib import contextmanager
from sqlalchemy import create_engine, event
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

        # SQLite disables FK enforcement by default; enable it on every connection
        # so ondelete="CASCADE" rules actually fire. PostgreSQL enforces FKs natively.
        if DB_URL and DB_URL.startswith("sqlite"):
            @event.listens_for(self.engine, "connect")
            def _enable_sqlite_fk(dbapi_conn, _):
                cursor = dbapi_conn.cursor()
                cursor.execute("PRAGMA foreign_keys=ON")
                cursor.close()

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
