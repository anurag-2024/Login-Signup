import React from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import '../styles/Username.css'
import toast,{Toaster} from "react-hot-toast";
import {useFormik} from "formik";
import {resetPasswordValidation} from "../helper/validate";
import {resetPassword} from "../helper/helper";
import { useAuthStore } from '../store/Store.js';
const Password = () => {
  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd:'',
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      const response= await resetPassword({username,password:values.password});
      console.log("Update Password",response);
      const loadingToast = toast.loading('Updating Password...');
      try{
        if(response?.status===200){
          console.log("hello brother");
          toast.success("Password updated successfully",{id:loadingToast});
          navigate("/password");
        }
        if(response?.status===400){
          toast.error("Password not Updated",{id:loadingToast});
        }
      }
      catch(err){
        toast.error("An error occurred while updating password",{id:loadingToast});
      }
    },
  });
  return (
    <div className='container mx-auto'>
    <Toaster position='top-center' reverseOrder={false}></Toaster>
     <div className='flex justify-center items-center h-screen'>
        <div className='glass' style={{width:"30%"}}>
          <div className='title flex flex-col items-center'>
           <h4 className='text-5xl font-bold'>Reset</h4>
           <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Enter new Password </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
             <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('password')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Enter new Password' />
              <input {...formik.getFieldProps('confirm_pwd')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Confirm Password' />
              <button type='submit' className='btn bg-red-500'>Update Password</button>
             </div>
          </form>
        </div>
     </div>
    </div>
  )
}

export default Password
