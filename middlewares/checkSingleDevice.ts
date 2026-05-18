import jwt from 'jsonwebtoken';
import db from '../models';
import { Response, NextFunction } from 'express';
import { JwtPayload, AuthRequest } from '../types';

const User = db.User;

const checkSingleDevice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('--- Bắt đầu check Single Device ---');

    const token: string | undefined = req.cookies?.token;
    if (!token) {
      console.log('Không tìm thấy Cookie!');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findByPk(decoded.id);

    console.log('Token Version:', decoded.version);
    console.log('DB Version:', user?.tokenVersion);

    if (!user || user.tokenVersion !== decoded.version) {
      console.log('=> Không khớp, Logout!');
      res.clearCookie('token');
      res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
      return;
    }

    console.log('=> Khớp! Cho qua.');
    req.user = decoded;
    next();
  } catch (error) {
    const err = error as Error;
    console.log('Lỗi Verify:', err.message);
    res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
  }
};

export default checkSingleDevice;