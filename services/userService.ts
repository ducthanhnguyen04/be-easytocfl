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

    async getAllUsers(): Promise<any[]> {
        return await User.findAll({
            attributes: ['id', 'userName', 'email', 'role', 'avatarUrl', 'isPremium', 'googleId', 'lastLogin', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
    }

    async updateUserRole(id: string | number, role: 'user' | 'admin'): Promise<any> {
        const user = await User.findByPk(id);
        if (!user) {
            const error: any = new Error('User not found');
            error.status = 404;
            throw error;
        }
        user.role = role;
        await user.save();
        return user;
    }

    async togglePremium(id: string | number): Promise<any> {
        const user = await User.findByPk(id);
        if (!user) {
            const error: any = new Error('User not found');
            error.status = 404;
            throw error;
        }
        user.isPremium = !user.isPremium;
        await user.save();
        return user;
    }

    async deleteUser(id: string | number): Promise<boolean> {
        const deleted = await User.destroy({ where: { id } });
        return deleted > 0;
    }

    async updateStreak(userId: number, duration: number, localDate: string): Promise<any> {
        const user = await User.findByPk(userId);
        if (!user) {
            const error: any = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const getDaysDiff = (d1Str: string, d2Str: string): number => {
            const [y1, m1, d1] = d1Str.split('-').map(Number);
            const [y2, m2, d2] = d2Str.split('-').map(Number);
            const utc1 = Date.UTC(y1, m1 - 1, d1);
            const utc2 = Date.UTC(y2, m2 - 1, d2);
            return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
        };

        let currentStreak = user.streakCount || 0;
        let studyTime = user.studyTimeToday || 0;
        const lastHeartbeat = user.lastHeartbeatDate;

        if (!lastHeartbeat) {
            user.lastHeartbeatDate = localDate;
            studyTime = 0;
        } else if (lastHeartbeat !== localDate) {
            const diff = getDaysDiff(lastHeartbeat, localDate);
            if (diff === 1) {
                if (studyTime < 300) {
                    currentStreak = 0;
                    user.streakCount = 0; // Update user object streak count!
                }
            } else if (diff > 1) {
                currentStreak = 0;
                user.streakCount = 0; // Update user object streak count!
            }
            studyTime = 0;
            user.lastHeartbeatDate = localDate;
        }

        studyTime += duration;
        user.studyTimeToday = studyTime;

        if (studyTime >= 300) {
            const lastStudy = user.lastStudyDate;
            if (lastStudy !== localDate) {
                if (lastStudy) {
                    const diffSinceLastStudy = getDaysDiff(lastStudy, localDate);
                    if (diffSinceLastStudy === 1) {
                        currentStreak += 1;
                    } else {
                        currentStreak = 1;
                    }
                } else {
                    currentStreak = 1;
                }
                user.lastStudyDate = localDate;
                user.streakCount = currentStreak;
            }
        }

        await user.save();

        return {
            streakCount: user.streakCount,
            studyTimeToday: user.studyTimeToday,
            lastStudyDate: user.lastStudyDate,
            lastHeartbeatDate: user.lastHeartbeatDate,
            streakCompletedToday: user.lastStudyDate === localDate
        };
    }
}

export default new UserService();

