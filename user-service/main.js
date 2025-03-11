const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = 8000;

app.use(bodyParser.json());

// Маршруты
app.use('/api/user', userRoutes);

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});