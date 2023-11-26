import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import '../styles/Username.css'
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import useFetch from '../hooks/fetch.hook';
import { profileValidation } from "../helper/validate";
import convertToBase64 from '../helper/convert';
import {updateUser} from "../helper/helper";
import { useAuthStore } from '../store/Store.js';
const Profile = () => {
 const {username}=useAuthStore(state=>state.auth);
 const data= useFetch(`user/${username}`);
 const apiData=data[0].apidata; 
  const [file, setfile] = useState();
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      firstName:apiData?.firstName||'',
      lastName:apiData?.lastName||'',
      mobile:apiData?.mobile||'',
      email:apiData?.email||'',
      address:apiData?.address||'',
    },
    enableReinitialize:true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: apiData?.profile || file || '' });
      const loadingToast = toast.loading('Updating...');
      try{
       const response=await updateUser(values);
        if(response.error){
          toast.error(response.error,{id:loadingToast});
        }
        else{
          toast.success("Updated Successfully!",{id:loadingToast});
        }
      }
      catch(err){
        toast.error("An error occurred while updating the profile.");
      }
    },
  });
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setfile(base64);
  } 
  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className='glass w-[60%] h-[99%]'>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>You can update the details </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4 mb-8 ml-[43%]'>
              <label htmlFor='profile' >
                <img src={apiData?.profile|| file || avatar} alt='' className='profile_img' />
              </label>
              <input onChange={onUpload} type='file' id='profile' name='profile' accept="image/png, image/jpeg" />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className='name flex w-3/4 gap-10'>
                <input {...formik.getFieldProps('firstName')} className=' h-10 p-3.5 items-center align-middle' type='text' placeholder='Firstname' />
                <input {...formik.getFieldProps('lastName')} className=' h-10 p-3.5 items-center align-middle' type='text' placeholder='Lastname' />
              </div>
              <div className='name flex w-3/4 gap-10'>
                <input {...formik.getFieldProps('mobile')} className=' h-10 p-3.5 items-center align-middle' type='text' placeholder='Mobile No.' />
                <input {...formik.getFieldProps('email')} className=' h-10 p-3.5 items-center align-middle' type='text' placeholder='Email*' />
              </div>
                <input {...formik.getFieldProps('address')} className='w-[74%] h-10 p-3.5' type='text' placeholder='Address' />
                <button type='submit' className='btn w-100 bg-red-500'>Update</button>
              </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>Come back later?
                <a onClick={() =>{localStorage.removeItem("token"), navigate("/")}} className='text-blue-500 cursor-pointer'>Logout</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>    
  )
}
export default Profile
