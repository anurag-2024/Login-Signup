import axios from 'axios';
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL =import.meta.env.VITE_APP_SERVER_DOMAIN;

/** get user token function */
export async function getUsername(){
    const token= await localStorage.getItem("token");
    if(!token) return Promise.reject("Token not found");
    let decode=await jwtDecode(token);
    return decode;
}
/** authenticate function */
export async function authenticate(username){
    try{
        return await axios.post("/api/authenticate",{username});
    }
    catch(err){
        return {error:"Username doen't exist...."}
    }
}

/** get User detail */
export async function getUser({username}){
    try{
        const {data}=await axios.get(`/api/user/${username}`);
        return data;
    }
    catch(err){
        return {error:"Password doen't match...."}
    }
}

/** register User function */
export async function registerUser(credentials){
    try{
        const {data:{msg},status}= await axios.post("/api/register",credentials);
        let {username,email}=credentials;
        if(status===201){
            await axios.post("/api/registerMail",{username,email});
        }
        return Promise.resolve(msg);
    }
    catch(err){
        return Promise.reject(err);
    }
}

/** login User function */

export async function verifyPassword({username,password}){
    try{
       if(username){
        const {data}=await axios.post("/api/login",{username,password});
        return Promise.resolve(data);
       }
    }
    catch(err){
        return Promise.resolve({error:"Password doesn't match...."});
    }
}

/** update user profile function */
export async function updateUser(response){
    try{
        const token=await localStorage.getItem("token");
        const data=await axios.put("/api/updateuser",response,{headers:{"Authorization":`Bearer ${token}`}});
        return Promise.resolve({data});
    }
    catch(err){
        return Promise.reject({err:"Unable to update user profile"});
    }
}

/** generate OTP function */
export async function generateOTP(username){
    try{
        const {data:{code},status}= await axios.get("/api/generateOTP",{params:{username}});
        if(status===201){
           const data= await getUser({username});
           let text=`Your Password Recovery code is ${code}`;
           await axios.post("/api/registerMail",{username,email:data.email,text,subject:"Password Recovery OTP"});
        }
        return Promise.resolve({code,status});
    }
    catch(err){
        return Promise.reject({err:"Unable to generate OTP"});
    }
}

/** verify OTP function */
export async function verifyOTP({username,code}){
  try{
   const {data,status}= await axios.get("/api/verifyOTP",{params:{username,code}});
   return {data,status};
  }
  catch(err){
    return Promise.reject({err:"Unable to verify OTP"});
  }
}

/** reset password function */
export async function resetPassword({username,password}){
    try{
        const {data,status}= await axios.put("/api/resetPassword",{username,password});
        return Promise.resolve({data,status});
    }
    catch(err){
        return Promise.reject({err:"Unable to reset password"});
    }
}
