const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

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

// Количество раундов для хэширования пароля
const SALT_ROUNDS = 10;

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
    const { username, email, phone, status, password } = req.body;
    
    if (!username || !email || !phone || !status || !password) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    try {
        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const query = `
            INSERT INTO afisha_db."user" (username, email, phone, status, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, phone, status, reg_date
        `;
        const values = [username, email, phone, status, hashedPassword];
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

// UPDATE - Обновление пользователя (обновлен для работы с паролем)
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, status, password } = req.body;
        
        let updateFields = [];
        let values = [];
        let valueIndex = 1;

        if (username) {
            updateFields.push(`username = $${valueIndex}`);
            values.push(username);
            valueIndex++;
        }
        if (email) {
            updateFields.push(`email = $${valueIndex}`);
            values.push(email);
            valueIndex++;
        }
        if (phone) {
            updateFields.push(`phone = $${valueIndex}`);
            values.push(phone);
            valueIndex++;
        }
        if (status) {
            updateFields.push(`status = $${valueIndex}`);
            values.push(status);
            valueIndex++;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            updateFields.push(`password = $${valueIndex}`);
            values.push(hashedPassword);
            valueIndex++;
        }

        values.push(id);
        const query = `
            UPDATE afisha_db."user"
            SET ${updateFields.join(', ')}
            WHERE id = $${valueIndex}
            RETURNING id, username, email, phone, status, reg_date
        `;
        
        const result = await pool.query(query, values);
        
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

// Добавим endpoint для аутентификации
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    try {
        const query = 'SELECT * FROM afisha_db."user" WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Не отправляем пароль в ответе
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
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