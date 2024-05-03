import User from "../model/user.model.js";
import errorHandler from "../utils/error.js";
import bcrypt from 'bcryptjs';

export const getUser = async (req, res, next) => {
    console.log("get alluser")
    try {
        const existingUser = await User.findById(req.params.userId);
        if (!existingUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const { password, ...rest } = existingUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const updateUserProfile = async (req, res, next) => {
    console.log("get update")
    const { username} = req.body;
    try {
        console.log("inside the try")
        if( req.body.password){
            console.log("inside password")
            if ( req.body.password.length < 6) {
            console.log("inside the try -1 ")
                return next(errorHandler(403, 'Password must be at least 6 character long'))
            }
            var newPassword = bcrypt.hashSync( req.body.password, 10)
            console.log("mew password",newPassword)
        }
        if (username) {
        console.log("inside the try -2 ")

            if (username.length < 7 || username.length > 20) {
                return next(errorHandler(400, "Username must be between 7 to 20 charachter long"))
            }
        }
        console.log("inside the try -3 ")
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password:newPassword,
            }
        },
            { new: true }
        )
        console.log("inside the try -4 ")

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
};

export const getAllUser = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all user'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            user: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        })
    } catch (error) {
        console.log(error.message)
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    console.log("get delte")
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

