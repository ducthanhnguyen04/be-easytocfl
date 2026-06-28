import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthRequest, AppError } from '../../types';
import AuthService from '../../services/authService';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  async login(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const { user, token } = await AuthService.loginLocal(email, password);

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      });

      return res.json({ message: 'Login successful', user });
    } catch (error) {
      const err = error as AppError;
      console.error('Login error:', err);
      return res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' });
    }
  }

  async googleLogin(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { credential } = req.body as { credential: string };

      if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
      }

      const { user, token } = await AuthService.loginGoogle(credential);

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      });

      return res.json({ message: 'Google login successful', user });
    } catch (error) {
      const err = error as AppError;
      console.error('Google login error:', err);
      return res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' });
    }
  }


  async logout(_req: AuthRequest, res: Response): Promise<Response> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return res.json({ message: 'Logout successfully!' });
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<Response> {
    return res.status(200).json({ success: true, user: req.user });
  }

  async register(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { userName, email, password } = req.body as { userName: string; email: string; password: string };

      if (!userName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newAccount = await AuthService.registerAccount(userName, email, password);
      return res.status(200).json({ success: true, data: newAccount });
    } catch (error) {
      const err = error as Error;
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new AuthController();