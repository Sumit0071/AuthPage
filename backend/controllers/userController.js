import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController {

    //User Registration
    static userRegistration = async ( req, res ) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        if ( name && email && password && password_confirmation && tc ) {
            if ( password === password_confirmation ) {
                try {
                    const user = await UserModel.findOne( { email: email } );
                    if ( user ) {
                        return res.send( { "status": "failed", "message": "Email already exists" } );
                    } else {
                        const salt = await bcrypt.genSalt( 10 );
                        const hashPassword = await bcrypt.hash( password, salt );
                        const doc = new UserModel( {
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        } );
                        await doc.save();
                        const saved_user = UserModel.findOne( { email: email } );
                        //Generating JWT token
                        const token = jwt.sign( { userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' } );
                        res.status( 201 ).send( { "status": "success", "message": "Registration successful", "token": token } );
                    }
                } catch ( err ) {
                    console.log( err );
                    res.send( { "status": "failed", "message": "Unable to register" } );
                }
            } else {
                res.send( { "status": "failed", "message": "Password and password confirmation do not match" } );
            }
        } else {
            res.send( { "status": "failed", "message": "All fields are required" } );
        }
    }

    //User Login
    static userLogin = async ( req, res ) => {
        try {
            const { email, password } = req.body;
            if ( email && password ) {
                const user = await UserModel.findOne( { email: email } );
                if ( user ) {
                    const isMatch = await bcrypt.compare( password, user.password );
                    if ( ( user.email === email ) && isMatch ) {
                        //Generate JWT token
                        const token = jwt.sign( { userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' } );
                        return res.send( { "status": "success", "message": "Login Successfull", "token": token } );
                    }
                    res.send( { "status": "failed", "message": "either password or email is incorrect" } )
                }
                else {
                    res.send( { "status": "failed", "message": "You're not a registered user" } );
                }

            }

            else {
                res.send( { "status": "failed", "message": "All fields are required" } );
            }
        }
        catch ( error ) {
            res.send( error );
            res.send( { "status": "failed", "message": "unable to Login" } );
        }
    }

    //Change Password
    static changeUserPassword = async ( req, res ) => {
        const { password, password_confirmation } = req.body;
        if ( password && password_confirmation ) {
            if ( password !== password_confirmation ) {
                res.send( { "status": "failed", "message": "New Password and confirm new password doesn't match" } );
            }
            else {
                const salt = await bcrypt.genSalt( 10 );
                const newhashPassword = await bcrypt.hash( password, salt );
                
                await UserModel.findByIdAndUpdate( req.User._id, { $set: { password: newhashPassword } } );
                res.send( { "status": "success", "message": "Password Changed succesfully" } )
            }
        }
        else {
            res.send( { "status": "failed", "message": "All fields are required" } );
        }

    }

    //Logged user info
    static loggedUser = async ( req, res ) => {
            res.send({"user":req.User})
    }

    // send email for reset password
    static sendUserPasswordResetEmail = async ( req, res ) => {
        const { email } = req.body;
        if ( email ) {
            const user = await UserModel.findOne( { email: email } );
            
            if ( user ) {
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jwt.sign( { userID: user._id }, secret, { expiresIn: '15m' } );
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
                console.log( link );
                res.send( { "status": "success", "message": "Password Reset Email sent to specified mail id Please check the mail" } );
            }
            else {
                res.send( { "status": "failed", "message": "Email does not Exist" } );
            }
        }
        else {
            res.send( { "status": "failed", "message": "Email field are required" } );
        }
}

    static userPasswordReset = async ( req, res ) => {
        const { password, password_confirmation } = req.body;
        const { id, token } = req.params;
        if (id.startsWith(':')) {
            id = id.slice(1);
        }

        // Validate if id is a valid ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ "status": "failed", "message": "Invalid user ID format" });
        }

        const user = await UserModel.findById( id );
        if (!user) {
            return res.status(400).send({ "status": "failed", "message": "User not found" });
        }
        const new_secret = user._id + process.env.JWT_SECRET_KEY;
        try {
            jwt.verify( token, new_secret ); 
            if ( password && password_confirmation ) {
                if ( password !== password_confirmation ) {
                    res.send( { "status": "failed", "message": "New Password and confirm password doesn't match" } );
                }
                else{
                    const salt = await bcrypt.genSalt( 10 );
                    const newhashPassword = await bcrypt.hash( password, salt );
                    await UserModel.findByIdAndUpdate( user._id, { $set: { password: newhashPassword } } );
                res.send( { "status": "success", "message": "Password Reset succesfully" } )
                }
            }
            else {
                res.send( { "status": "failed", "message": "All field are required" } );
            }
        }
        catch ( err ) {
            res.send( { "status": "failed", "message": "Invalid Token" } );
        }
    }
}

export default UserController;
