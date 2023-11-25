import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import '../styles/Username.css'
import toast, {Toaster} from "react-hot-toast";
import {useFormik} from "formik";
import {registerValidation} from "../helper/validate";
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
const Password = () => {
  const [file,setfile]=useState();
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      email:'',
      username: '',
      password: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values= await Object.assign(values,{profile:file||''});
      const loadingToast = toast.loading('Registering...');
      try{
       const response=await registerUser(values);
        if(response.error){
          toast.error("Registration Failed!",{id:loadingToast});
        }
        else{
          toast.success("Registered Successfully!",{id:loadingToast});
          navigate("/");
        }
      }
      catch(err){
        toast.error("An error occurred while registering the user.",{id:loadingToast});
      }
    },
  });
  const onUpload=async (e)=>{
    const base64=await convertToBase64(e.target.files[0]);
    setfile(base64);
  }
  return (
    <div className='container mx-auto'>
    <Toaster position='top-center' reverseOrder={false}></Toaster>
     <div className='flex justify-center items-center h-screen'>
        <div className='glass w-[30%] h-[99%]'>
          <div className='title flex flex-col items-center'>
           <h4 className='text-5xl font-bold'>Register</h4>
           <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Happy to join with you </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
             <div className='profile flex justify-center py-4 mb-8 ml-24'>
              <label htmlFor='profile' >
              <img src={file||avatar} alt='' className='profile_img' />
              </label>
             <input onChange={onUpload} type='file' id='profile' name='profile' accept="image/png, image/jpeg" />
             </div>
             <div className='textbox flex flex-col items-center gap-6'>
             <input {...formik.getFieldProps('email')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Email' />
             <input {...formik.getFieldProps('username')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Username' />
              <input {...formik.getFieldProps('password')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Password' />
              <button type='submit' className='btn bg-red-500'>Sign up</button>
             </div>
             <div className='text-center py-4'>
              <span className='text-gray-500'>Already Signed?
              <a onClick={()=>navigate("/")} className='text-blue-500 cursor-pointer'>Sign in</a>
              </span>
             </div>
          </form>
        </div>
     </div>
    </div>
  )
}

export default Password
