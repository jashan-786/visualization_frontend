import { useRef } from "react";
import Header from "./components/Header";   
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Wrapper from "./components/Wrapper";
import { IoIosClose } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { connectionUrl } from "./utils/connectionUrl";      
export default function AddUser() {
  const navigate = useNavigate();
  const onClickHandler = async () => {

    
   const email = emailRef.current?.value;
   const username = usernameRef.current?.value;
   const description = descriptionRef.current?.value;
    console.log(email, username, description);
    if(!email || !username){
      alert("Email and Username are required");
      return;
    }
   try{
    const response = await axios.post(`${connectionUrl}/api/v1/adduser`, { email, username, description },

        {
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
    console.log(response);
    if(response.status === 201){
      alert("User added successfully");
    }
    else{
      alert("User already exists");
    }
   }
   catch(error){
    console.log(error);
   }
  }

  const resetHandler = () => {
    if(emailRef.current) emailRef.current.value = "";
    if(usernameRef.current) usernameRef.current.value = "";
    if(descriptionRef.current) descriptionRef.current.value = "";
  }

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  return (
   
   
        <div className=" flex flex-col justify-between">
        <Header />
    
      { localStorage.getItem("token") ?
       <div className="py-8 md:py-12 flex items-center justify-center bg-gray-100 min-h-screen px-4">
        <div className="w-full max-w-[95%] md:max-w-[600px] bg-white flex flex-col rounded-lg shadow-lg p-4 md:p-8">
          <div className="flex items-center flex-col justify-between mb-4 md:mb-6">
    
            <div className="flex items-center justify-between py-2 md:py-4 w-full">
              <h1 className="text-xl md:text-2xl font-bold">Add User</h1>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="material-symbols-outlined cursor-pointer text-2xl transform hover:scale-110 transition-transform duration-300"
              >
                <IoIosClose />
              </button>
            </div>
    <form className="space-y-4 w-full">
      <div className="space-y-6">
       
    
        <div className="relative">
          <input
            type="email"
            ref={emailRef}
            placeholder="New Email Address (required)"
            className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
          />
          <span className="material-symbols-outlined absolute right-3 top-3">
            <CiMail />
          </span>
        </div>
    
        <div className="relative">
          <input
            type="text"
            ref={usernameRef}
            placeholder="New Username (required)"
            className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
          />  
          <span className="material-symbols-outlined absolute right-3 top-3">
            <CiMail />
          </span>
        </div>
    
        <div className="relative">
          <textarea
            ref={descriptionRef}
            placeholder="Description"
            className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 h-24 md:h-32 resize-none"
          />
        </div>
      </div>
    
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onClickHandler();
            resetHandler();
          }} 
          className="w-full sm:flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Add Connection
        </button>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            resetHandler();
          }} 
          className="w-full sm:flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Reset
        </button>
      </div>
    </form>
    
    
    
          </div>
          </div>
          </div>
          
    
      : <Wrapper/>}
       </div>
       
    
     
      )
    }
    