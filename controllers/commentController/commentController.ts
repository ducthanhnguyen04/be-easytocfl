import commentService from "../../services/commentService";
import { Request, Response } from "express";
import { CreateCommentDto, UpdateCommentDto } from "../../types";

class CommentController {
    async getAllComments(req: Request, res: Response): Promise<Response> {
        try {
            const comments = await commentService.getAllComments();
            return res.status(200).json({ message: 'Get all comments successfully', comments });
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }
    async createComment(req: Request, res: Response): Promise<Response> {
        try {
            const { content, userId } = req.body as CreateCommentDto;
            if (!content || !userId) {
                return res.status(400).json({ message: 'Content and userId are required' });
            }
            const newComment = await commentService.createComment({ content, userId });
            return res.status(201).json({ message: 'Create comment successfully', comment: newComment });
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }
    async deleteComment(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string;
            if (!id) {
                return res.status(400).json({ message: 'Comment ID is required' });
            }
            const deleted = await commentService.deleteComment(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            return res.status(200).json({ message: 'Delete comment successfully' });
        } catch (error) {
            const err = error as Error;
            return res.status(500).json({ error: err.message });
        }
    }
}

export default new CommentController();
