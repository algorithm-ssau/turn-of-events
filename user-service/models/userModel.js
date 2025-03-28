const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

class UserModel {
    static async create(userData) {
        const { username, email, phone, status, password } = userData;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        const query = `
            INSERT INTO afisha_db."user" (username, email, phone, status, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, phone, status, reg_date
        `;
        const values = [username, email, phone, status, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query('SELECT * FROM afisha_db."user"');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM afisha_db."user" WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, userData) {
        const { username, email, phone, status, password } = userData;
        let updateFields = [];
        let values = [];
        let valueIndex = 1;

        if (username) {
            updateFields.push(`username = $${valueIndex}`);
            values.push(username);
            valueIndex++;
        }
        // ...остальные поля...
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
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM afisha_db."user" WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }

    static async authenticate(email, password) {
        const result = await pool.query('SELECT * FROM afisha_db."user" WHERE email = $1', [email]);
        if (result.rows.length === 0) return null;

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) return null;
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

module.exports = UserModel;