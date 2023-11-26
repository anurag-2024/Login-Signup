import React from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import '../styles/Username.css'
import toast, {Toaster} from "react-hot-toast";
import {useFormik} from "formik";
import {passwordValidate} from "../helper/validate";
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/Store.js';
import { verifyPassword } from '../helper/helper';
import { getUsername } from "../helper/helper";
const Password = () => {
  const {username}=useAuthStore(state=>state.auth);
 const data= useFetch(`user/${username}`);
// const isLoading=data[0].isLoading;
const apiData=data[0].apidata;  
// const serverError=data[0].serverError;
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      const loadingToast = toast.loading('Verifying...');
      try {
        const response = await verifyPassword({ username, password: values.password });
        if (response.error) {
          toast.error(response.error); 
        } else {
          toast.success("Verified Successfully!",{id:loadingToast});
          let { token } = response;
          localStorage.setItem("token", token);
          navigate("/profile");
        }
      } catch (error) {
        toast.error("An error occurred while verifying the password.",{id:loadingToast});
      }
    },
  });
  return (
    <div className='container mx-auto'>
    <Toaster position='top-center' reverseOrder={false}></Toaster>
     <div className='flex justify-center items-center h-screen'>
        <div className='glass'>
          <div className='title flex flex-col items-center'>
           <h4 className='text-5xl font-bold'>Hello {apiData?.firstName||username}</h4>
           <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Explore more by connecting to us </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
             <div className='profile flex justify-center py-4 mx-auto'>
              <img src={apiData?.profile||avatar} alt='' className=''/>
             </div>
             <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('password')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Password' />
              <button type='submit' className='btn bg-red-500'>Sign in</button>
             </div>
             <div className='text-center py-4'>
              <span className='text-gray-500'>Forgot Password?
              <a onClick={()=>navigate("/recovery")} className='text-blue-500 cursor-pointer'>Recover Now</a>
              </span>
             </div>
          </form>
        </div>
     </div>
    </div>
  )
}
export default Password