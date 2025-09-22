import React from 'react'
import {GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from '../utils/firebase';
import photo1 from '../assets/images/photo1.jpg'
import photo2 from '../assets/images/photo2.jpg'
import photo3 from '../assets/images/photo3.jpg'
import photo4 from '../assets/images/photo4.jpg'




const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID token
      const token = await user.getIdToken();
      console.log(token)

      // Verify with backend
      const res = await fetch("http://localhost:8000/protected", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json()
      if(data.exists){
        navigate("/main")
      }
      else{
        navigate("/display-name")
      }

    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
     <div className="flex h-screen bg-[#FFFAF0]">
        <div className="w-[62.5%] flex flex-col justify-center items-center">
            <div className="bg-[#D3E3FC] text-[#333] text-[60px] leading-[73px] px-6 py-3 mb-6 shadow-md capitalize text-center font-junge">In The Moment</div>
            <button onClick={handleLogin} className="relative bg-[#FFCBBB] text-[#333] text-lg px-6 py-2 shadow font-junge overflow-hidden transition-all duration-300 hover:bg-[#ffb3a1] group"> 
                <span className="absolute inset-0 border-2 border-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Login</span>
            </button>
        </div>

         <div className="w-[2px] bg-black"></div>

        <div className="w-[37.5%] bg-[#DDE7F7] h-screen relative flex items-center justify-center">

            <div className="absolute top-[7.5%] left-[3%] w-[265px] h-[180px] border-2 border-black bg-transparent z-50"></div>
            <div className="absolute top-[71%] right-[5%] w-[265px] h-[175px] border-2 border-black bg-transparent z-50"></div>
            <div className="absolute top-[5%] left-[44%] w-[100px] h-[100px] bg-[#00887A] animate-bounce-slow"></div>
            <div className="absolute top-[84%] right-[49%] w-[100px] h-[100px] bg-[#00887A] animate-bounce-slow"></div>
            <div className="absolute top-[45%] left-[2%] w-[100px] h-[100px] bg-[#77A6F6] animate-bounce-slow"></div>

            <img
                src={photo1}
                alt="scene 1"
                className="absolute top-[10%] left-[5%] w-[260px] h-[170px] object-cover shadow-md z-40 opacity-0 animate-fade-in"/>

             <img
                src={photo2}
                alt="scene 2"
                className="absolute top-[30%] right-[5%] w-[260px] h-[170px] object-cover shadow-md z-30 opacity-0 animate-fade-in"
            />

            <img
                src={photo3}
                alt="scene 3"
                className="absolute top-[50%] left-[8%] w-[260px] h-[170px] object-cover shadow-md z-20 opacity-0 animate-fade-in"
            />

            <img
                src={photo4}
                alt="scene 4"
                className="absolute top-[70%] right-[8%] w-[260px] h-[170px] object-cover shadow-md z-10 opacity-0 animate-fade-in"
            />

            </div>
    </div>
  )
}

export default Login