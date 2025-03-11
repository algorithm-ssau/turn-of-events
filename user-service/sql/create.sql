-- Создание схемы
CREATE SCHEMA IF NOT EXISTS afisha_db;

-- Создание таблицы user
CREATE TABLE IF NOT EXISTS afisha_db."user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(45) NOT NULL UNIQUE,
    email VARCHAR(45) NOT NULL UNIQUE,
    phone VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reg_date DATE NOT NULL DEFAULT CURRENT_DATE,
    "status" VARCHAR(45) NOT NULL
);
