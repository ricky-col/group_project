import jwt from "jsonwebtoken";
import UserModel from "../models/User.js"
import bcrypt from "bcryptjs";
import {config} from 'dotenv'
config()
//register function
export const register = async (userObj)=>
{
    //create document
    const userDoc = new UserModel(userObj)
    //validate  for empty password
    await userDoc.validate();
    //hash and replace the password
    userDoc.password = await bcrypt.hash(userDoc.password,10)
    //save
    const created = await userDoc.save();
    //convert document to object to remove password
    const newUserObj = created.toObject();
    //remove password
    delete newUserObj.password
    //return user obj without password
    return newUserObj
}; 

//authenticate function
export const authenticate = async ({email,password})=>
{
    //check user eith email and role
    const user = await UserModel.findOne({email});
    if(!user){
        const err = new Error("Invalid email");
        err.status=401
        throw err
    }
    //if user valid but blocked by admin


    //compare  passwords
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        const err = new Error("Invalid password")
        err.status= 401
        throw err
    }

    //generate token
    const token=jwt.sign({userID:user._id},
    process.env.JWT_SECRET,{
    expiresIn:"1d"});

    const userObj = user.toObject();
    delete userObj.password;

    return {token, user: userObj}
};