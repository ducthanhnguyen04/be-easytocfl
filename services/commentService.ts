import db from '../models';
import { CreateCommentDto, UpdateCommentDto } from '../types';

const Comments = db.Comments;
const Users = db.User;

class CommentService {
    async getAllComments() {
        return await Comments.findAll({
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'userName', 'email', 'avatarUrl']
                }
            ],
            nest: true
        });
    }
    async createComment(data: CreateCommentDto) {
        return await Comments.create(data);
    }
    async updateComment(commentId: string, data: UpdateCommentDto) {
        const comment = await Comments.findByPk(commentId);
        if (!comment) return null;
        await comment.update(data);
        return comment;
    }
    async deleteComment(commentId: string) {
        const deleted = await Comments.destroy({ where: { id: commentId } });
        return deleted > 0;
    }
}

export default new CommentService();