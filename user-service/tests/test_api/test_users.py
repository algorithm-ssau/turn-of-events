import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_register_user():
    response = client.post("/api/auth/register", json={"username": "testuser", "password": "testpass"})
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"

def test_login_user():
    client.post("/api/auth/register", json={"username": "testuser", "password": "testpass"})
    response = client.post("/api/auth/login", data={"username": "testuser", "password": "testpass"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_user_profile():
    client.post("/api/auth/register", json={"username": "testuser", "password": "testpass"})
    login_response = client.post("/api/auth/login", data={"username": "testuser", "password": "testpass"})
    access_token = login_response.json()["access_token"]
    response = client.get("/api/profiles/me", headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_update_user_profile():
    client.post("/api/auth/register", json={"username": "testuser", "password": "testpass"})
    login_response = client.post("/api/auth/login", data={"username": "testuser", "password": "testpass"})
    access_token = login_response.json()["access_token"]
    response = client.put("/api/profiles/me", headers={"Authorization": f"Bearer {access_token}"}, json={"username": "updateduser"})
    assert response.status_code == 200
    assert response.json()["username"] == "updateduser"