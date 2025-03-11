const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 8000;

// Создаем пул подключений к PostgreSQL
const pool = new Pool({
    user: 'admin',
    host: 'postgres',
    database: 'afisha_db',
    password: 'admin123',
    port: 5432,
});

app.use(bodyParser.json());

// Инициализация БД
async function init() {
    try {
        const sqlFilePath = path.join(__dirname, 'sql', 'create.sql');
        const sqlScript = await fs.readFile(sqlFilePath, 'utf8');
        await pool.query(sqlScript);
        console.log('База данных успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        process.exit(1);
    }
}

// Endpoint для инициализации БД
app.get('/api/users/init', async (req, res) => {
    try {
        await init();
        res.json({ message: 'База данных успешно инициализирована' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE - Создание нового пользователя
app.post('/api/users', async (req, res) => {
    const { username, email, phone, status } = req.body;
    
    if (!username || !email || !phone || !status) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    try {
        const query = `
            INSERT INTO afisha_db."user" (username, email, phone, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [username, email, phone, status];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Получение всех пользователей
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM afisha_db."user"');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Получение конкретного пользователя по ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM afisha_db."user" WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - Обновление пользователя
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, status } = req.body;
        
        const query = `
            UPDATE afisha_db."user"
            SET username = COALESCE($1, username),
                email = COALESCE($2, email),
                phone = COALESCE($3, phone),
                status = COALESCE($4, status)
            WHERE id = $5
            RETURNING *
        `;
        
        const result = await pool.query(query, [username, email, phone, status, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Удаление пользователя
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM afisha_db."user" WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        
        res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});