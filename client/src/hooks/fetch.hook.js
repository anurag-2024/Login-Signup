import axios from "axios";
import {useEffect,useState} from "react";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL =import.meta.env.VITE_APP_SERVER_DOMAIN;

export default function useFetch(query){
    const [getData,setData]=useState({
        isloading:false,
        apidata:undefined,
        status:null,
        serverError:null,
    })
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                setData(prev=>({...prev,isLoading:true}));
                const {username}= query? await getUsername():"";
                const {data,status}=query?await axios.get(`/api/user/${username}`):await axios.get(`/api/${query}`);
                console.log("Data"+data);
                if(status===201){
                    setData(prev=>({...prev,isLoading:false}));
                    setData(prev=>({...prev,apidata:data,status:status}));
                }
                setData(prev=>({...prev,isLoading:false}));
            }
            catch(err){
                setData(prev=>({...prev,isLoading:false,serverError:err}));
            }
        }
        fetchData();
    },[query]);
    return [getData,setData];
}