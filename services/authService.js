const { where } = require("sequelize");
const crypto = require("crypto");
const model = require("../models/index");
const User = model.User;
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require("../utils/auth");

class AuthService {
    async loginLocal(email, password) {
        const user = await User.findOne({
            where: {
                email,
            }
        });
        if(!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 401;
            throw error;
        }
        // const newVersion = crypto.randomBytes(16).toString("hex");
        // await User.update(
        //     { tokenVersion: newVersion },
        //     { where: { id: user.id } }
        // );
        const token = jwt.sign(
            { 
                id: user.id, 
                name: user.userName,
                email: user.email, 
                role: user.role,
                avatarUrl: user.avatarUrl,
                // version: newVersion,
            }, 
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );
        const safeUser = {
            id: user.id,
            name: user.userName,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
        }
        return {
            user: safeUser,
            token,
        }
    };
    async registerAccount(userName, email, password) {
        const hashedPassword = await hashPassword(password);
        const newAccount = await User.create({
            userName: userName,
            email: email,
            password: hashedPassword,
            googleId: '',
            avatarUrl: `${process.env.BACKEND_URL}/avatars/default.png`,
            role: 'user',
        })
        return newAccount;
    }
}
module.exports = new AuthService();