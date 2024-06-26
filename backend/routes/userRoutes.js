import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();


//public Routes
router.post('/register',UserController.userRegistration)



//Protected Routes


export default router;