import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        if (name && email && password && password_confirmation && tc) {
            if (password === password_confirmation) {
                try {
                    const user = await UserModel.findOne({ email: email });
                    if (user) {
                        return res.send({ "status": "failed", "message": "Email already exists" });
                    } else {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        });
                        await doc.save();
                        res.send({ "status": "success", "message": "Registration successful" });
                    }
                } catch (err) {
                    console.log(err);
                    res.send({ "status": "failed", "message": "Unable to register" });
                }
            } else {
                res.send({ "status": "failed", "message": "Password and password confirmation do not match" });
            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" });
        }
    }
}

export default UserController;
