import mongoose from "mongoose";

//SCHEMA definition
const userSchema = new mongoose.Schema( {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    tc:{type:Boolean,required:true}
    
} )

//Model 
const UserModel=mongoose.model("User",userSchema)

export default UserModel;