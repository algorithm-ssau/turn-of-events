import pytest

@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    from src.main import app

    with TestClient(app) as client:
        yield client