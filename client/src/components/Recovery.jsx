import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Username.css'
import toast, { Toaster } from "react-hot-toast";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useAuthStore } from '../store/Store.js';
const Recovery = () => {
  const [OTP, setOTP] = useState(null);
  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();

  useEffect(()=>{
    async function getData(){
      const loadingToast = toast.loading('Generating OTP...');
      const response= await generateOTP(username);
      console.log("Generate OTP",response);
      if(response?.status===201){
        toast.success("OTP sent to your email address",{id:loadingToast});
      }
      else toast.error("OTP not sent",{id:loadingToast});
    }
    getData();
  },[username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Verifying OTP...');
    const result = await verifyOTP({ username, code: OTP || code });
    if (result?.status === 200) {
      toast.success(result?.data.message, {id:loadingToast});
      return navigate("/reset");
    }
    if(result.status===400){
      return toast.error(result?.data.error, {id:loadingToast});
    }
  };

  function resendOTP(){
    const loadingToast = toast.loading('Sending OTP...');
    const code = generateOTP(username);
    if(code){
      toast.success("OTP sent to your email address",{id:loadingToast});
    }
    else toast.error("OTP not sent",{id:loadingToast});
  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className='glass'>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover password
            </span>
          </div>
          <form className='py-2' onSubmit={handleSubmit}>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className='text-center'>
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address
                </span>
                <input onChange={(e) => setOTP(e.target.value)} className='w-100 h-10 p-3.5 items-center align-middle' type='text' placeholder='Enter the OTP' />
              </div>
              <button type='submit' className='btn bg-red-500'>Recover</button>
            </div>
          </form>
          <div className='text-center py-4'>
            <span className='text-gray-500'>Didn't Receive OTP? <a onClick={resendOTP} className='text-red-500 cursor-pointer'>Resend OTP</a></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recovery
