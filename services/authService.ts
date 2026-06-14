import db from '../models';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/auth';
import { AppError, JwtPayload, SafeUser } from '../types';

const User = db.User;

class AuthService {
  async loginLocal(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error: AppError = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password as string);
    if (!isPasswordValid) {
      const error: AppError = new Error('Invalid password');
      error.status = 401;
      throw error;
    }

    const payload: JwtPayload = {
      id: user.id as number,
      name: user.userName as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
      avatarUrl: user.avatarUrl as string | undefined,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    const safeUser: SafeUser = {
      id: user.id as number,
      name: user.userName as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
      avatarUrl: user.avatarUrl as string | undefined,
    };

    return { user: safeUser, token };
  }

  async registerAccount(userName: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const newAccount = await User.create({
      userName,
      email,
      password: hashedPassword,
      googleId: null,
      avatarUrl: `${process.env.BACKEND_URL}/avatars/default.png`,
      role: 'user',
    });
    return newAccount;
  }
}

export default new AuthService();