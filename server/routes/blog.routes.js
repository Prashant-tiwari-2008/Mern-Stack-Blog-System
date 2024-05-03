import express from 'express';
import {create,update,addLike,deleteBlog,getblog,getAllBlog,mostPopular,random,gatBlogByTag,gatBlogByCategory,search} from '../controller/blog.controller.js';
import verifyToken from '../utils/verifyToken.js';

const routes = express.Router();

routes.post('/create',verifyToken,create);
routes.get("/getblog/:blogId",getblog);
routes.put("/update/:blogId",verifyToken,update);
routes.delete("/delete/:blogId",verifyToken, deleteBlog);
routes.get("/getBlogs", getAllBlog);

//other routes
routes.get('/mostpopular',mostPopular);
routes.get('/getByCategory/:category',gatBlogByCategory);
routes.get('/getByTag/:tag',gatBlogByTag);
routes.get("/addlike/:blogId",addLike);
routes.get('/random',random);
routes.get('/search',search);

export default routes;