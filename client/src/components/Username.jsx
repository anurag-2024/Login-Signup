import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import '../styles/Username.css'
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernameValidate } from "../helper/validate";
import { useAuthStore } from '../store/Store.js';
// import { useGoogleOneTapLogin } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
const Username = () => {
  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);
  // const setEmail = useAuthStore(state => state.setverified_Email);
  // useGoogleOneTapLogin({
  //   onSuccess: credentialResponse => {
  //     const decoded = jwtDecode(credentialResponse?.credential);
  //     const verified=decoded?.email_verified;
  //     if(verified===true){
  //       console.log(decoded.given_name);
  //       setEmail(decoded.email_verified)
  //       setUsername(decoded.given_name);

  //       navigate("/profile");
  //     }
  //   },
  //   onError: () => {
  //     console.log('Login Failed');
  //   },
  // });
  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username);
      navigate("/password");
    },
  });
  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder='false'></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className='glass'>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Explore more by connecting to us </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4 mx-auto'>
              <img src={avatar} alt='' className='' />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('username')} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Username' />
              <button type='submit' className='btn bg-red-500'>Let's Go</button>
            </div>

            {/* <GoogleLogin
              onSuccess={credentialResponse => {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log(decoded);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            /> */}

            <div className='text-center py-4'>
              <span className='text-gray-500'>Don't have an account?
                <a onClick={() => navigate("/register")} className='text-blue-500 cursor-pointer'>Register Now</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Username
