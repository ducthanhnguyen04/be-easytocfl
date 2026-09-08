import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import db from "../models";

const Lesson = db.Lessons;
const User = db.User;

export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const rawLessonId = req.query.lessonId || req.query.lesson_id || req.params.lessonId || req.params.id || req.body?.lessonId;

        if (rawLessonId) {
            const lessonId = Number(rawLessonId);
            if (!isNaN(lessonId)) {
                const lesson = await Lesson.findByPk(lessonId);
                // If lesson exists and is not premium (free lesson), allow access to all authenticated users
                if (lesson && !lesson.isPremium) {
                    return next();
                }
            }
        }

        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findByPk(req.user.id);

        if (!user?.isPremium) {
            return res.status(403).json({
                message: 'Premium required'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};