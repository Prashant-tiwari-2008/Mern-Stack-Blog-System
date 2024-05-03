import jwt from 'jsonwebtoken';
import errorHandler from './error.js';

const verifyToken = (req,res,next) =>{
    const token = req.cookies.access_token // todo:need to read the diff
    if(!token) {
        console.log("token is not present")
        return next(errorHandler(401, 'Unauthorized: token is not present'));
    }
    jwt.verify(token,process.env.JWT,(err,user) => {
        if(err){
            console.log("token is not present but error")
            return next(errorHandler(401, `Unauthorized : ${err}`))
        }
        req.user = user;
        next();
    })
}

export default verifyToken;