import {create} from "zustand";

export const useAuthStore=create((set)=>({
    auth:{
        username:"",
        email_verfied:false,
    },
    setUsername:(name)=>set((state)=>({auth:{...state.auth,username:name}})),
    setverified_Email:(name)=>set((state)=>({auth:{...state.auth,email_verfied:name}})),
}));