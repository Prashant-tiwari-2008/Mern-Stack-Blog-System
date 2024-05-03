import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import {create,replyComment, getPostComments,getComments,likeComment,editComment,deleteComment,getComment} from '../controller/comment.controller.js'
const routes = express.Router();

routes.post("/create",verifyToken,create);
routes.get("/getComments", verifyToken,getComments)
routes.post("/:commentId/replyComment/:blogId",verifyToken,replyComment)
routes.get("/getPostComments/:blogId",getPostComments);
routes.get("/likeComment/:commentId",verifyToken,likeComment);
routes.put('/editComment/:commentId',verifyToken,editComment);
routes.delete('/delete/:commentId',verifyToken,deleteComment);


export default routes;