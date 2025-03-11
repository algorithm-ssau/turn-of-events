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

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id);
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            
            const updatedUser = await UserModel.update(id, userData);
            
            if (!updatedUser) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await UserModel.delete(id);
            
            if (!deletedUser) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            res.json({ message: 'Пользователь успешно удален' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ message: 'Email и пароль обязательны' });
            }

            const user = await UserModel.authenticate(email, password);
            
            if (!user) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;