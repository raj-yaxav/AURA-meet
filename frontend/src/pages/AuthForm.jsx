import { Video, Eye, EyeOff, Mail, Lock, User, ArrowRight, Home } from "lucide-react";
// import React from "react";
import { useContext, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useNavigate();
  const {handleRegister , handleLogin} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    username: "",
    password: "",
  });

  const handleInputChange = (ev) => {
    setFormData((currData) => {
      return { ...currData, [ev.target.name]: ev.target.value };
    });
  };

  const handleSubmit = async(ev) => {
    ev.preventDefault();
   try{
if(isLogin){
    const {username , password} = formData;
   
    let result = await handleLogin(username , password);
    
       toast.success(result);
    setTimeout(() => {
   
   router("/home");

    },1000)
    


    }else if(!isLogin){
      const {name , username , password , email} = formData;
       let result =  await handleRegister(name , username , email , password);
        toast.success(result);
    setTimeout(() => {
         setFormData({ name:"",
    email: "",
    username: "",
    password: "",
  })
    setIsLogin(!isLogin);
    },1000)
// console.log(result);
    }
   }catch(err){
   
   toast.error(err.response.data.message);
   return;
   }
    
    
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
        name: "",
      email: "",
      username: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative p-4 overflow-hidden">
      {/* Animated Background styling*/}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse -top-48 -left-48" />
        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 -bottom-32 -right-32" />
        <div className="absolute w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Video className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              AuraMeet
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {" "}
            {isLogin ? "Welcome Back" : "Join AuraMeet"}
          </h1>
          <p className="text-slate-400 text-lg">
            {isLogin
              ? "Sign in to continue your journey"
              : "Create your account and start connecting"}
          </p>
        </div>

        {/* Auth form  */}

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="space-y-6">

            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                />
              </div>
            )}


            <div className="relative">
              {/* username Field */}
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transitions-colors p-1"
              >
                {" "}
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex item-center justify-center space-x-2 group"
              onClick={handleSubmit}
            >
              <span>{isLogin ? "Sign In" : "Create Account"}</span>

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <div className="mt-8 text-center">
              <p className="text-slate-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 hover:underline"
                >
                  {isLogin ? "Register" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2025 AuraMeet. All rights reserved.
          </p>
        </div>
      </div>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #475569'
          }}
        />
     
    </div>
  );
}
