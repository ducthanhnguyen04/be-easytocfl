import db from '../models';
import { SafeUser } from '../types';
import { comparePassword, hashPassword } from '../utils/auth';

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
            isPremium: !!user.isPremium,
        };
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
        const user = await User.findByPk(userId);

        if (!user) {
            const error: any = new Error('User not found');
            error.status = 404;
            throw error;
        }

        // Verify current password
        const isMatch = await comparePassword(currentPassword, user.password as string);
        if (!isMatch) {
            const error: any = new Error('Mật khẩu hiện tại không đúng!');
            error.status = 400;
            throw error;
        }

        // Hash and save new password
        user.password = await hashPassword(newPassword);
        await user.save();
    }
}

export default new UserService();
