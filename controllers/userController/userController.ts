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

            if (req.user?.isGoogleLogin) {
                return res.status(400).json({ message: 'Tài khoản đăng nhập bằng Google không thể thay đổi thông tin.' });
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
                isPremium: !!updatedUser.isPremium,
                isGoogleLogin: req.user?.isGoogleLogin,
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

    async changePassword(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (req.user?.isGoogleLogin) {
                return res.status(400).json({ message: 'Tài khoản đăng nhập bằng Google không thể đổi mật khẩu.' });
            }

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới!' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
            }

            await userService.changePassword(userId, currentPassword, newPassword);

            return res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ message: err.message || 'Đổi mật khẩu thất bại' });
        }
    }

    async getAllUsers(_req: AuthRequest, res: Response): Promise<Response> {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({ message: 'Lấy danh sách người dùng thành công', users });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    async updateUserRole(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const { role } = req.body as { role: 'user' | 'admin' };

            if (!role || (role !== 'user' && role !== 'admin')) {
                return res.status(400).json({ message: 'Role không hợp lệ. Chỉ chấp nhận user hoặc admin.' });
            }

            const updatedUser = await userService.updateUserRole(id, role);
            return res.status(200).json({ message: 'Cập nhật quyền người dùng thành công', user: updatedUser });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ message: err.message || 'Cập nhật quyền thất bại' });
        }
    }

    async togglePremium(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const updatedUser = await userService.togglePremium(id);
            return res.status(200).json({ message: 'Cập nhật trạng thái Premium thành công', user: updatedUser });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ message: err.message || 'Cập nhật Premium thất bại' });
        }
    }

    async deleteUser(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            const isDeleted = await userService.deleteUser(id);
            if (!isDeleted) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
            }
            return res.status(200).json({ message: 'Xóa người dùng thành công' });
        } catch (error) {
            const err = error as AppError;
            return res.status(err.status || 500).json({ message: err.message || 'Xóa người dùng thất bại' });
        }
    }
}

export default new UserController();

