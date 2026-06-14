import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";

function checkAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: "No permission" });
        return;
    }
    next();
}

export default checkAdmin;