import User from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';

/** middleware to verify User */
export async function verifyUser(req,res,next){
    try{
       const {username}=req.method==="GET"?req.query:req.body;
       let exist=await User.findOne({username});
       if(!exist){
           return res.status(404).send(error.message);
       }
        next();
    }
    catch(err){
        return res.status(404).send(err.message);
    }
}

export async function register(req, res) {
    try {
        const { username, email, profile, password } = req.body;
        // check username
        const existUsername=await User.findOne({username});
        if(existUsername){
            return res.status(400).send({error:"Username already exists"});
        }
        const existEmail=await User.findOne({email});
        if(existEmail){
            return res.status(400).send({error:"Email already exists"});
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                profile:profile||"",
                password:hashedPassword
            });
            await user.save()
            return res.status(201).send({msg:"User registered successfully"});
        }else{
            return res.status(400).send({error:"Password is required"});
        }
    } catch (error) {
        return res.status(500).send({ error: "Unable to register user" });
    }
}

export async function login(req, res) {
     const {username,password}=req.body;
     try{
        User.findOne({username})
        .then(user=>{
            bcrypt.compare(password,user.password)
             .then((passwordCheck)=>{
                if(!passwordCheck){
                    return res.status(400).send(error.message);
                }
                //create jwt token
                const token=jwt.sign({
                    userId:user._id,
                    username:user.username,
                },process.env.JWT_SECRET,{expiresIn:"24h"});
                return res.status(200).send({
                    message:"Login successful",
                    username:user.username,
                    userId:user._id,
                    token
                });
             })
             .catch(err=>{
                    return res.status(404).send(err.message);
             })
        })
        .catch(err=>{
            return res.status(500).send(err.message);
        })
     }
     catch(err){
        return res.status(500).send(err.message);
     }
}
export async function getUser(req, res) {
    const {username}=req.params;
    try{
       if(!username){
           return res.status(400).send(error.message);
       }
         let existUser=await User.findOne({username});
         if(!existUser){
             return res.status(404).send(error.message);
         }
         //remove password from response
         const {password,...rest}=existUser._doc;
        return res.status(201).send(rest);
    }
    catch(err){
        return res.status(404).send(err.message);
    }
}
export async function generateOTP(req, res) {
    req.app.locals.OTP= otpGenerator.generate(6, {specialChars: false, lowerCaseAlphabets: false,upperCaseAlphabets:false});
    res.status(201).send({code:req.app.locals.OTP});
}
export async function verifyOTP(req, res) {
    const {code}=req.query;
    if(parseInt(code)===parseInt(req.app.locals.OTP)){
        req.app.locals.OTP=null;
        req.app.locals.resetSession=true;
        return res.status(200).send({message:"OTP Verified"});
    }
    return res.status(400).send({error:"Invalid OTP"});
}
export async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        // req.app.locals.resetSession=false;
        return res.status(201).send({flag:req.app.locals.resetSession});
    }
    return res.status(400).send({error:"Session expired"});
}

export async function resetPassword(req, res) {
    try{
        // console.log(req.app.locals.resetSession);
        if(!req.app.locals.resetSession) return res.status(400).send({error:"Session expired"});
        const {username,password}=req.body;
        try{
             User.findOne({username})
             .then(user=>{
                 bcrypt.hash(password,10)
                 .then(hashedPassword=>{
                    User.updateOne({username:user.username},{password:hashedPassword})
                    .then(user=>{
                        req.app.locals.resetSession=false;
                        return res.status(200).send(user);
                    })
                    .catch(err=>{
                        return res.status(400).send(err.message);
                    })
                 })
                 .catch(err=>{
                    return res.status(500).send(err.message);
                 })
             })
        }
        catch(err){
            return res.status(404).send(err.message);
        }
    }
    catch(err){
        return res.status(401).send(err.message);
    }
}

export async function updateUser(req, res) {
    try{
       const {userId}=req.user;
    //    console.log(req.user)
       if(userId){
           const body=req.body;
        //    console.log(body);
           User.updateOne({_id:userId},body)
           .then((data)=>{
            //   console.log(data);
               return res.status(200).send(data);
           })
           .catch((err)=>{
               return res.status(400).send(err.message);
           })
       }
       else{
        return res.status(401).send(error.message);
       }
    }
    catch(err){
        return res.status(404).send(err.message);
    }
}