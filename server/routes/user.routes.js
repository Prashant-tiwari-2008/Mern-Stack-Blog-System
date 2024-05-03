import express from 'express';
import {getUser, updateUserProfile,getAllUser,deleteUser} from '../controller/user.controller.js';
import verifyToken from '../utils/verifyToken.js'

const routes = express.Router();

// todo : need to read 
// if /:userId is the first url then by default getuser divert to this function 
routes.put('/update/:userId',verifyToken,updateUserProfile);
routes.get('/getusers',verifyToken, getAllUser);
routes.delete('/delete/:userId',verifyToken, deleteUser);
routes.get('/:userId',getUser);


export default routes;