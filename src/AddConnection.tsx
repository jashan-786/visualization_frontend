import { MdOutlineBadge } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useRef, use } from "react";
const addConnection = async (mainUserEmail: string, mainUserName: string, conUserEmail: string, conUserName: string, connection: string) => {
  const response = await fetch("http://localhost:3000/api/v1/addconnection", {
    method: "POST",
    body: JSON.stringify({ mainUserEmail, mainUserName, conUserEmail, conUserName, connection }),
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if(!response.ok){
    alert("Failed to add connection");
  }
  else{
    alert("Connection added successfully");
  }

  return response.json();
};


export const AddConnection = () => {
  const navigate = useNavigate();
  const mainUserEmail= useRef<HTMLInputElement>(null);
  const conUserEmail = useRef<HTMLInputElement>(null);
  const mainUserName= useRef<HTMLInputElement>(null);
 const conUserName= useRef<HTMLInputElement>(null);
 const connection = useRef<HTMLInputElement>(null);
  
  const fileInput= useRef<HTMLInputElement>(null);
  const handleAddConnection = () => {
    if (!mainUserEmail.current?.value || !conUserEmail.current?.value || !mainUserName.current?.value || !conUserName.current?.value || !connection.current?.value) {
      alert("Please fill in all required fields");
      return;
    }
    if(localStorage.getItem("token")==null){
      alert("Please login to add connection");
      return;
    }
    addConnection(mainUserEmail.current.value, mainUserName.current.value, conUserEmail.current.value, conUserName.current.value, connection.current.value);
  };

  // send a data to backend instead of file
  const handleUploadFile = () => {
    const file = fileInput.current?.files?.[0];
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    
  };  
  

  return (
    <div className=" flex  flex-col  justify-between  h-screen ">
      <Header />
    <div className="  py-12 flex items-center justify-center   bg-gray-100">
      <div className="w-[600px] bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add Connection</h1>
          <span className="material-symbols-outlined cursor-pointer transform hover:scale-110 transition-transform duration-300">
            <IoIosClose  onClick={() => navigate("/")}/>
          </span>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              ref={mainUserEmail}
              type="email"
              placeholder="Email Address (required)"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            />
            <span className="material-symbols-outlined absolute right-3 top-3">
              <CiMail />
            </span>
          </div>
          <div className="relative">
            <input
              ref={mainUserName}
              type="text"
              placeholder="Main Username (required)"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            />
            <span className="material-symbols-outlined absolute right-3 top-3">
              <CiMail />
            </span>
          </div>

          <div className="relative">
            <input
              ref={conUserEmail}
              type="email"
              placeholder="Connection Email (required)"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            />
            <span className="material-symbols-outlined absolute right-3 top-3">
              <MdOutlineBadge />
            </span>
          </div>

          <div className="relative">
            <input
              ref={conUserName}
              type="text"
              placeholder="Connection Username (required)"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            />
            <span className="material-symbols-outlined absolute right-3 top-3">
              <CiMail />
            </span>
          </div>

          <div className="relative">
            <input
              ref={connection}
              type="text"
              placeholder="Connection Type (required)"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            />
            <span className="material-symbols-outlined absolute right-3 top-3">
              <MdOutlineBadge />
            </span>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/")} className="px-6 py-3 border rounded-lg hover:bg-gray-50  transform hover:scale-105 duration-300">
              Cancel
            </button>
            <button onClick={handleAddConnection} className="px-6 py-3 w-44 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300">
              Add Connection
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2">info</span>
              <p className="text-sm">
                Current connections will appear in the visualizer after being
                added
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 ">  
            <p className="text-lg  text-center ">
              or
            </p>
          </div>
          <div>
          <div className="mt-1 p-1 text-2xl font-bold "> 
            Upload Json Connections File 
            </div>  
            <div className="mt-1 p-1 flex items-center justify-between">
            <input className="border p-2 mt-1  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300" type="file" accept=".json"/>
            <button  onClick={handleUploadFile} className="p-2 py-3 w-44 bg-blue-500 ml-2  text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"> Upload File</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
