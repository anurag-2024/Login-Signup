import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/Store";
import axios from "axios";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_DOMAIN;

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem("token");
    const { email_verfied } = useAuthStore(state => state.auth);
    console.log("Authorize", email_verfied);
    if (!token) {
        if(email_verfied===true){
            return;
        }
        return <Navigate to={"/"} replace={true}></Navigate>
    }
    return children;
}

export const ProtectUser = ({ children }) => {
    const { username } = useAuthStore(state => state.auth);
    console.log("Protect", username);
    if (!username) {
        return <Navigate to={"/"} replace={true}></Navigate>
    }
    return children;
}

export const ProtectResetPassword =({ children }) => {
    useEffect(() => {
        const getData = async () => {
            const response = await axios.get("/api/createResetSession");
            console.log("Reset Password", response);
            if (response?.status !== 201 || response?.data?.flag !== true) {
                return <Navigate to={"/password"} replace={true}></Navigate>
            }
        }
      getData();
    },[])
    return children;
}