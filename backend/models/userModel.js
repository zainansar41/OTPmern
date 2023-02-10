import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "please provide unique username"],
        unique:[true, "already exists"]
    },
    password:{
        type:String,
        required:[true,"please provide a  password"]
    },
    email:{
        type:String,
        required:[true,"please provide an Email"],
        unique:[true,"Mail Alrady exists"]
    },
    firstName:{
        type:String
    },
    lastName:{type:String},
    mobileNo:{type:Number},
    address:{type:String},
    profile:{type:String}
})

export default mongoose.model.Users || mongoose.model('User',UserSchema)