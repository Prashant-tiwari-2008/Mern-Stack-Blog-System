import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: "Guest"
        },
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        commentedAt: {
            type: Date,
            default: Date.now()
        },
        replies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
    },
    { timestamps: true }
)
//todo : need to learn about it
commentSchema.pre("find", function (next) {
    this.populate({ path: "replies", populate: { path: "creatorId" } })
    next();
})

export default mongoose.model('Comment', commentSchema)