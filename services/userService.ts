import db from '../models';
import { SafeUser } from '../types';

const User = db.User;

class UserService {
    async checkIsPremium(userId: number): Promise<{ isPremium: boolean }> {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'isPremium'],
        });

        if (!user) {
            const error: any = new Error('User not found');
            error.status = 404;
            throw error;
        }

        return { isPremium: !!user.isPremium };
    }

    async updateProfile(userId: number, userName: string, email: string, avatarUrl?: string): Promise<SafeUser> {
        const user = await User.findByPk(userId);

        if (!user) {
            const error: any = new Error('User not found');
            error.status = 404;
            throw error;
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                const error: any = new Error('Email already in use');
                error.status = 400;
                throw error;
            }
        }

        user.userName = userName;
        user.email = email;
        if (avatarUrl !== undefined) {
            user.avatarUrl = avatarUrl;
        }

        await user.save();

        return {
            id: user.id,
            name: user.userName,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
        };
    }
}

export default new UserService();

