import userService from "../../services/userService";
import { Response } from "express";
import { AuthRequest, AppError } from "../../types";
import jwt from 'jsonwebtoken';

class UserController {
    async checkIsPremium(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const result = await userService.checkIsPremium(userId);

            return res.status(200).json({
                message: 'Check premium status successfully',
                isPremium: result.isPremium,
            });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            const { userName, email, avatarUrl } = req.body as { userName: string; email: string; avatarUrl?: string };

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (!userName || !email) {
                return res.status(400).json({ message: 'Username and email are required' });
            }

            const updatedUser = await userService.updateProfile(userId, userName, email, avatarUrl);

            // Re-sign a token with updated user details
            const payload = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatarUrl: updatedUser.avatarUrl,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7,
                path: '/',
            });

            return res.status(200).json({
                message: 'Update profile successfully',
                user: updatedUser,
            });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
        }
    }
}

export default new UserController();

