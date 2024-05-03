import Blog from '../model/blogs.model.js';
import User from '../model/user.model.js';
import errorHandler from '../utils/error.js';

export const create = async (req, res, next) => {
    const { isAdmin, title, content } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (isAdmin) {
            return res.next(errorHandler(403, 'You are not allowd to create a Blog'));
        }
        if (!title || !content) {
            return next(errorHandler(400, 'Please provide all require fields'));
        }

        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

        const newBlog = new Blog({
            ...req.body,
            slug,
            creator: user.id
        })

        const savedBlog = await newBlog.save();
        await User.findByIdAndUpdate(user.id, {
            $push: { blogs: savedBlog._id }
        },
            { new: true }
        );

        res.status(200).json(savedBlog);
    } catch (error) {
        next(error)
    }
}

export const getblog = async (req, res, next) => {
    try {
        // const existingBlog = await Blog.findOne({ id: req.params.id }).populate('creator', 'name profilePicture').populate('comments')
        const existingBlog = await Blog.findOne({_id: req.params.blogId}).populate('creator', 'name profilePicture')
        if (!existingBlog) {
            return next(errorHandler(401, "there is no such blog"));
        }
        return res.status(200).json(existingBlog);
    } catch (error) {
        next(error);
    }
}

export const update = async (req, res, next) => {
    const { title, content, banner } = req.body;
    try {
        const existingBlog = await Blog.findOne({ _id: req.params.blogId })
        if (!existingBlog) {
            return next(errorHandler(204, 'Blog not Found'));
        }
        const updatedBlog = await Blog.findOneAndUpdate(existingBlog._id, {
            $set: { title, content, banner }
        }, { new: true });
        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error)
    }
}

export const getAllBlog = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const blogs = await Blog.find()
            .sort({ createAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalBlogs =  await Blog.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        )

        const lastMonthBlogs = await Blog.countDocuments({
            createdAt : {$gte : oneMonthAgo}
        })

        res.status(200).json({
            blogs,
            totalBlogs,
            lastMonthBlogs
        })
    } catch (error) {
        next(error);
    }
}

export const deleteBlog = async (req, res, next) => {
    const {blogId} = req.params;
    try {
        const existingBlog = await Blog.findById(blogId);
        if(!existingBlog){
            return next(errorHandler(403,"No Such blog found in database"));
        }
        if (!req.user.isAdmin && req.user.id != existingBlog.creator) {
            return next(errorHandler(403, 'You are not allowed to delete this post'));
        }
        await Blog.findByIdAndDelete(req.params.blogId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }

}


export const mostPopular = async (req, res, next) => {
    try {
        const blogs = await Blog.find().sort({ likes: -1 }).skip(0).limit(9).populate("creator", "name profilePicture");
        res.status(200).json({ blogs });
    } catch (error) {
        next(error);
    }
}

export const addLike = async (req, res, next) => {
    try {
        await Blog.findOneAndUpdate(req.params.id, {
            $inc: { likes: 1 }
        });
        res.status(200).json("the view has been incresed.");
    } catch (error) {
        next(err);
    }
}

export const gatBlogByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        const blogs = await Blog.find({category : {$regex : category,$options :"i"}}).populate("creator","name profilePicture");      
        res.status(200).json({blogs})
    } catch (error) {
        next(error);
    }
}

// need to update
export const gatBlogByTag = async (req, res, next) => {

}

export const search = async (req, res, next) => {

}

export const random = async (req, res, next) => {
    try {
        const blogs = await Blog.aggregate([{$sample:{size : 6}}])
        res.status(200).json({blogs})
    } catch (error) {
        next(error)
    }
}