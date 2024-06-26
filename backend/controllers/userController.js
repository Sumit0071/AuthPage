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
                        const token = jwt.sign( { userID: saved_user._id },process.env.JWT_SECRET_KEY, { expiresIn: '5d' } );
                        res.status( 201 ).send( { "status": "success", "message": "Registration successful","token":token } );
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
                        const token = jwt.sign( { userID: user._id },process.env.JWT_SECRET_KEY, { expiresIn: '5d' } );
                        return res.send( { "status": "success", "message": "Login Successfull" ,"token":token} );
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

    static changeUserPassword = async ( req, res ) => {
        const { password, password_confirmation } = req.body;
        if ( password && password_confirmation ) {
            if ( password !== password_confirmation ) {
                res.send( { "status": "failed", "message": "New Password and confirm new password doesn't match" } );
            }
            else {
                const salt = await bcrypt.genSalt( 10 );
                const newhashPassword = await bcrypt.hash( password, salt );
            }
        }
        else {
            res.send( { "status": "failed", "message": "All fields are required" } );
        }
    }
}

export default UserController;
