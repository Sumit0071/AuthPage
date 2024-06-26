import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();


//public Routes
router.post( '/register', UserController.userRegistration );
router.post( '/login', UserController.userLogin );


//Protected Routes
router.post( '/changePassword', UserController.changeUserPassword );

export default router;