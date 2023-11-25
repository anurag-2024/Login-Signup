import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username already exists"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        unique:false,
    },
    firstName:{type:String},
    lastName:{type:String},
    mobile:{type:Number},
    address:{type:String},
    profile:{type:String}
});
const User=mongoose.model("User",UserSchema);
export default User;