import axios, { HttpStatusCode } from 'axios';
import { createContext, useContext, useState } from 'react';
import {status} from 'http-status';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const AuthContext  = createContext({});

const client = axios.create({
     baseURL : "http://localhost:8080/api/v1/users"
})

export const AuthProvider = ({children}) => {
const authContext = useContext(AuthContext);

    const router = useNavigate();


const handleRegister = async(name , username , email , password) => {

    try{
     let request = await client.post("/register" , {
        name : name,
        username : username,
        email : email,
        password : password
     })

     if(request.status === status.CREATED) {
        return request.data.message;
     }
    }catch(err){
        throw err;
    }
}


const handleLogin = async(username , password) => {

    try{
     let request = await client.post("/login" , {
        username : username,
        password : password
     })

     if(request.status === status.OK) {
        localStorage.setItem("token" , request.data.token);
       return request.data.message;

     }
     


    }catch(err){
        throw err;
    }
}



    const [userData , setUserData] = useState(authContext);







    const data = {
        userData , setUserData , handleRegister , handleLogin
    }




    return (
       < AuthContext.Provider value={data} >
        {children}
       </AuthContext.Provider> 
    )



 }