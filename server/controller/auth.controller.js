import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    console.log("inside signup",req.body)
    const { username, email, password } = req.body;

    if (!email || !password) {
        next(errorHandler(400, 'Required data missing'))
    }
    try {
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "Email is already in use"
            })
        }

        // todo : need to read abot
        // hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        //creat a new user
        const newUser = new User({ ...req.body, password: hashPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT, { expiresIn: "10days" })
        res.status(200).json({ token, user: newUser })

        // todo need to userstand
        // const { password: pass, ...rest } = newUser._doc;

        // res.status(200).cookie('access_token', token, {
        //     httpOnly: true
        // }).json(rest);

    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid Password'));
        }

        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT, { expiresIn: "10 day" });

        // todo need to userstand
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest);

    } catch (error) {
        next(error)
    }
}

//todo : need to complete
export const google = async (req,res,next) =>{

}

export const signout = async(req,res,next) => {
    try {
        res.clearCookie('access_token').status(200).json('User ha been signed out Successfully')
    } catch (error) {
        next(error)
    }
}
