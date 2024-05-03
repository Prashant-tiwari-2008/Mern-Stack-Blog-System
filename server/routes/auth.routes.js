import express from 'express';
import {signup,signin,google,signout} from '../controller/auth.controller.js';
const routes = express.Router();

routes.post('/signup', signup);
routes.post('/signin', signin);
routes.post('/google',google);
routes.get('/signout',signout);

export default routes;