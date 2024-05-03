import User from "../model/user.model.js";
import Blog from "../model/blogs.model.js";
import Comment from "../model/comment.model.js";
import errorHandler from "../utils/error.js";


export const create = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ _id: req.body.currentBlogId });
        // todo : no need to check this inside the verify token there is already check
        // todo : verify the same in testing 
        // if(userId !== req.user.id){
        //     return next(errorHandler(403, "You are not allowed to create this comment"));
        // }

        const newComment = new Comment({
            creatorId: req.body.userId,
            blogId: req.body.currentBlogId,
            content: req.body.content
        });

        const savedComment = await newComment.save()
        await Blog.findOneAndUpdate(blog._id, {
            $push: { comment: savedComment._id }
        }, { new: true }
        )
        res.status(200).json({
            comment: savedComment,
            message: "Comment saved successfullly"
        })


    } catch (error) {
        next(error)
    }
}

export const replyComment = async (req, res, next) => {
    const { commentId, blogId } = req.params;
    try {
        const replyComment = new Comment({
            creatorId: req.user.id,
            blogId,
            parentComment: commentId,
            ...req.body,
        })
        const savedReplyComment = await replyComment.save();
        await Comment.findByIdAndUpdate({ _id: commentId, blogId }, {
            $push: { replies: savedReplyComment._id }
        }, { new: true }
        )
        res.status(200).json(savedReplyComment);
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        next(error); 3
    }
}

export const likeComment = async (req, res, next) => {
    try {
        let comment = await Comment.findByIdAndUpdate(req.params.commentId, {
            $inc: { likes: 1 }
        }, { new: true })
        console.log("comment", comment);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        res.status(200).json("The likes has been incresed");
    } catch (error) {
        next(error);
    }
}

export const editComment = async (req, res, next) => {
    const { commentId } = req.params;
    const { content } = req.body;
    try {
        const existingComment = await Comment.findOne({ _id: commentId });
        console.log("existingComment", existingComment.creatorId);
        console.log("req.user.id", req.user.id)
        if (existingComment.creatorId != req.user.id) {
            return next(errorHandler(401, "You are not authrized to edit comment"));
        }
        const updatedComment = await Comment.findByIdAndUpdate(existingComment._id, {
            $set: { content }
        }, { new: true });

        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    try {
        const existingComment = await Comment.findOne({ _id: commentId });
        if (req.user.id != existingComment.creatorId && !req.user.isAdmin) {
            return next(errorHandler(401, "You are not allowed to delete"));
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json( "data deleted successfully")
    } catch (error) {
        next(error);
    }
}

export const getComment = async (req, res, next) => {
    const { commentId } = req.params;
    try {
        const existingComment = Comment.findOne({ _id: commentId });
        res.status(200).json(existingComment);
    } catch (error) {
        next(error)
    }
}

export const getComments = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to access these daata"));
    }
    try {
        const startIndex = req.query.startIndex || 0;
        const limit = req.query.limit || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const comments = await Comment.find()
            .sort({ createAt: sortDirection })
            .skip(startIndex)
            .limit(limit)

        const totalComment = await Comment.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthComment = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            comments,
            totalComment,
            lastMonthComment
        })
    } catch (error) {
        console.log(error.message);

    }
}