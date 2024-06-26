import express from 'express';
import UserController from '../controllers/userController.js';
import UserModel from '../models/user.js';
import checkUserAuth from '../middleware/auth-middleware.js';
const router = express.Router();
//Router level Middleware -To protect Route
router.use( '/changePassword', checkUserAuth );

//public Routes
router.post( '/register', UserController.userRegistration );
router.post( '/login', UserController.userLogin );


//Protected Routes
router.post( '/changePassword', UserController.changeUserPassword );

export default router;