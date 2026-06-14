import { Response, NextFunction } from "express";
import { AuthRequest, JwtPayload } from "../types";
import db from "../models";
import jwt from "jsonwebtoken";

const Lesson = db.Lessons;
const User = db.User;

export async function CheckPremiumAccess(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const lessonId = req.query.lessonId || req.params.lessonId;

        if (!lessonId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin lessonId." });
        }

        const lesson = await Lesson.findByPk(lessonId as string);
        if (!lesson) {
            return res.status(404).json({ success: false, message: "Bài học không tồn tại." });
        }

        if (!lesson.isPremium) {
            return next();
        }

        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để truy cập." });
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        } catch (err) {
            return res.status(401).json({ success: false, message: "Phiên đăng nhập hết hạn" });
        }

        const user = await User.findByPk(decoded.id);
        if (!user || user.tokenVersion !== decoded.version) {
            res.clearCookie('token');
            return res.status(401).json({ success: false, message: "Phiên đăng nhập hết hạn" });
        }

        req.user = decoded;

        if (user.role === 'admin' || user.isPremium) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Bài học này chỉ dành cho tài khoản Premium. Vui lòng nâng cấp!",
            isLocked: true
        });

    } catch (error) {
        console.error("Error in CheckPremiumAccess Middleware:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống khi xác thực quyền Premium." });
    }
}