import db from '../models';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
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
      isPremium: !!user.isPremium,
      isGoogleLogin: false,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    const safeUser: SafeUser = {
      id: user.id as number,
      name: user.userName as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
      avatarUrl: user.avatarUrl as string | undefined,
      isPremium: !!user.isPremium,
      isGoogleLogin: false,
      streakCount: user.streakCount || 0,
      longestStreak: Math.max(user.longestStreak || 0, user.streakCount || 0),
      studyTimeToday: user.studyTimeToday || 0,
      lastStudyDate: user.lastStudyDate,
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

  async loginGoogle(credential: string): Promise<{ user: SafeUser; token: string }> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (e) {
      const error: AppError = new Error('Invalid Google token');
      error.status = 401;
      throw error;
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      const error: AppError = new Error('Invalid Google token payload');
      error.status = 400;
      throw error;
    }

    const { sub: googleId, email, name, picture } = payload;

    // 1. Try to find user by googleId
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // 2. If not found by googleId, try to find user by email
      user = await User.findOne({ where: { email } });

      if (user) {
        // Link Google account to existing user and update details
        await user.update({
          googleId,
          userName: user.userName || name || email.split('@')[0],
          avatarUrl: picture || user.avatarUrl || `${process.env.BACKEND_URL}/avatars/default.png`,
          lastLogin: new Date(),
        });
      } else {
        // 3. Register new user
        // Generate a random secure password because the password column is non-nullable (allowNull: false)
        const randomPassword = Math.random().toString(36).slice(-10) + Date.now().toString(36);
        const hashedPassword = await hashPassword(randomPassword);

        user = await User.create({
          userName: name || email.split('@')[0],
          email,
          password: hashedPassword,
          googleId,
          avatarUrl: picture || `${process.env.BACKEND_URL}/avatars/default.png`,
          role: 'user',
          lastLogin: new Date(),
        });
      }
    } else {
      // User found by googleId, update lastLogin and sync latest profile info from Google
      await user.update({
        userName: name || user.userName,
        avatarUrl: picture || user.avatarUrl,
        lastLogin: new Date(),
      });
    }


    // Generate App JWT
    const jwtPayload: JwtPayload = {
      id: user.id as number,
      name: user.userName as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
      avatarUrl: user.avatarUrl as string | undefined,
      isPremium: !!user.isPremium,
      isGoogleLogin: true,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    const safeUser: SafeUser = {
      id: user.id as number,
      name: user.userName as string,
      email: user.email as string,
      role: user.role as 'user' | 'admin',
      avatarUrl: user.avatarUrl as string | undefined,
      isPremium: !!user.isPremium,
      isGoogleLogin: true,
      streakCount: user.streakCount || 0,
      longestStreak: Math.max(user.longestStreak || 0, user.streakCount || 0),
      studyTimeToday: user.studyTimeToday || 0,
      lastStudyDate: user.lastStudyDate,
    };

    return { user: safeUser, token };
  }
}

export default new AuthService();