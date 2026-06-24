import { Response, NextFunction } from "express";
import { AuthRequest, JwtPayload } from "../types";
import db from "../models";
import jwt from "jsonwebtoken";

const Lesson = db.Lessons;
const User = db.User;

export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.user.id);

    if (!user?.isPremium) {
        return res.status(403).json({
            message: 'Premium required'
        });
    }

    req.user = user;
    next();
};