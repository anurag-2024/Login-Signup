import toast from "react-hot-toast";
import { authenticate } from "./helper";

export async function usernameValidate(values){
    const errors={};
    usernameVerfiy(errors,values);
    if(values.username){
        const {status}=await authenticate(values.username);
        if(status!==200){
            errors.exist=toast.error("User does not exist...");
        }
    }
    return errors;
}
export async function passwordValidate(values){
    const errors={};
    passwordVerfiy(errors,values);
    return errors;
}
export async function resetPasswordValidation(values){
    const errors={};
    passwordVerfiy(errors,values);
    if(values.password!==values.confirm_pwd){
        errors.exist=toast.error("Password and Confirm Password must be same...");
    }
    return errors;
}
export async function registerValidation(values){
    const errors={};
    usernameVerfiy(errors,values);
    passwordVerfiy(errors,values);
    emailValidate(errors,values);
    // console.log(errors);
    return errors;
}
export async function profileValidation(values){
    const errors={};
    emailValidate(errors,values);
    return errors;
}
function passwordVerfiy(error={},values){
    // const specialChar=['!','@','#','$','%','^','&','*','(',')','_','+','{','}','|',':','"','<','>','?','`','~','-','=','[',']',';',"'",',','.','/','\\'];
    const specialChar = /[!@#\$%^&*()_+{}\[\]:;<>,.?~\\-]/;
    if(!values.password){
        error.password=toast.error("Password is required...");
    }
    else if(values.password.includes(" ")){
        error.password=toast.error("Password can't contain spaces...");
    }
    else if(values.password.length<4){
        error.password=toast.error("Password must be at least 4 characters long...");
    }
    else if(!specialChar.test(values.password)){
        error.password=toast.error("Password must contain at least one special character...");
    }
    return error;
}
function usernameVerfiy(error={},values){
    if(!values.username){
        error.username=toast.error("Username is required...");
    }
    else if(values.username.includes(" ")){
        error.username=toast.error("Username can't contain spaces...");
    }
    return error;
}
function emailValidate(error={},values){
    if(!values.email){
        error.email=toast.error("Email is required...");
    }
    else if(values.email.includes(" ")){
        error.email=toast.error("Email can't contain spaces...");
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email=toast.error("Invalid email address...");
    }
    
    return error;
}
