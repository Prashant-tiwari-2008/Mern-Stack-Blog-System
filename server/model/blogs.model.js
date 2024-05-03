import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true
        },
        category :{
            type : String,
            default : 'uncategorized',
        },
        likes : {
            type : Number,
            default : 0
        },
        comment: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Comment',
            default: []
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Blog', blogSchema)