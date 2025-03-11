const UserModel = require('../models/userModel');

class UserController {
    static async createUser(req, res) {
        try {
            const { username, email, phone, status, password } = req.body;
            
            if (!username || !email || !phone || !status || !password) {
                return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
            }

            const user = await UserModel.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // ...остальные методы контроллера...
}

module.exports = UserController;