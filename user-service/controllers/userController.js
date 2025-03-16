const UserModel = require('../models/userModel');
const pool = require('../config/database');

console.log('UserController initialized');

class UserController {
    static async createUser(req, res) {
        try {
            const { username, email, phone, password } = req.body;
            
            if (!username || !email || !phone || !password) {
                return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
            }

            const user = await UserModel.create(req.body);
            console.log(`User created: ${user.username} (${user.email})`);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.findAll();
            console.log(`Retrieved ${users.length} users`);
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
                console.log(`User not found: ${id}`);
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            console.log(`Retrieved user: ${user.username} (${user.email})`);
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
                console.log(`User not found for update: ${id}`);
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            console.log(`User updated: ${updatedUser.username} (${updatedUser.email})`);
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
                console.log(`User not found for deletion: ${id}`);
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            
            console.log(`User deleted: ${deletedUser.username} (${deletedUser.email})`);
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
                console.log(`Failed login attempt for email: ${email}`);
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            console.log(`User logged in: ${user.username} (${user.email})`);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = UserController;
