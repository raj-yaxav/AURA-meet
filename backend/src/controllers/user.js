import {status} from 'http-status';
import {User} from '../models/user.js';
import bcrypt , { hash } from 'bcrypt';
import ExpressError from '../utils/ExpressError.js';
import crypto from 'crypto';
export const UserRegister = async(req,res) => {
    try{
 const { name , username , email , password } = req.body;
    const existingUser = await User.findOne({username : username});
    const existingEmail = await User.findOne({email : email});

   if(existingUser){
    return res.status(status.FOUND).json({"message" : "user already exists"});
   }
   if(existingEmail){
    return res.status(status.FOUND).json({"message" : "Email already exists"});

   }
const hashedPass = await bcrypt.hash(password , 10);
    let newUser =  new User({

        name : name,
        username : username,
        email : email,
        password : hashedPass,
    })

    await newUser.save();
    return res.status(status.CREATED).json({"message" : "user registered succesfully"});
   
    }catch(err){
        return res.status(400).json({"message" : `${err.message}`});
    }
   

}


export const loginUser = async(req,res,next) => {
try{

const {username , password} = req.body;
    if(!username || !password){
        return res.status(400).json({"message" : "please provide required fields"});
    }
    
    const user = await  User.findOne({username : username});
    // console.log(user);
    if(!user){

        return res.status(status.NOT_FOUND).json({"message" : "user not exist"});
    }
    let checkPass = await bcrypt.compare(password , user.password);
    if(checkPass){
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();
        return res.status(status.OK).json({"message" : `Welcome back ${user.name.toUpperCase()}` ,
            "token" : `${token}`});

    }else{
        return res.status(status.NOT_FOUND).json({"message" : "passowrd is incorrect"});
    }

}catch(err){
        return res.status(400).json({"message" : `${err.message}`});
  
}
    

}