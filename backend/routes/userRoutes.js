import express from 'express';
import UserController from '../controllers/userController.js';
import UserModel from '../models/user.js';
import checkUserAuth from '../middleware/auth-middleware.js';
const router = express.Router();
//Router level Middleware -To protect Route
router.use( '/changePassword', checkUserAuth );
router.use( '/loggedUser', checkUserAuth );

//public Routes
router.post( '/register', UserController.userRegistration );
router.post( '/login', UserController.userLogin );
router.post( '/send-reset-password-email', UserController.sendUserPasswordResetEmail );
router.post( '/reset-password/:id/:token', UserController.userPasswordReset );

//Protected Routes
router.post( '/changePassword', UserController.changeUserPassword );
router.get( '/loggedUser', UserController.loggedUser );

export default router;