import { MdOutlineBadge } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Wrapper from "./components/Wrapper";
import { connectionUrl } from "./utils/connectionUrl";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

interface ConnectionData{
  mainUserEmail: string;
  mainUserName: string;
  conUserEmail: string;
  conUserName: string;
  connection: string;
}




export const AddConnection = () => {
  const navigate = useNavigate();
  const mainUserEmail= useRef<HTMLInputElement>(null);
  const conUserEmail = useRef<HTMLInputElement>(null);
  const mainUserName= useRef<HTMLInputElement>(null);
 const conUserName= useRef<HTMLInputElement>(null);
 const connection = useRef<HTMLInputElement>(null);
  const [selecteduser, setSelectedUser] = useState<any>(null);
  const [selecteduser2, setSelectedUser2] = useState<any>(null);
  const fileInput= useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [users2, setUsers2] = useState<any[]>([]);
  const [connectionType, setConnectionType] = useState<string>("");
  const searchuser= debounce( async (email: string, loadingValue:string) => {

   
    console.log( "true")
    console.log(email)
   await fetch(`${connectionUrl}/api/v1/connections/${email}`, {
      method: "GET",
  
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (response) => {
      console.log("done") 
      if(loadingValue == "1"){
      setLoading(false)
      }
      else{
        setLoading2(false)
      }
      const data = await response.json();
      console.log(data)
      if(loadingValue == "1"){
        setUsers(data.users)
      }
      else{
        setUsers2(data.users)
      }
    }).catch(() => {
      console.log("no results found")
      setTimeout (() => setLoading(false),500) 
    })

    console.log(users)
    console.log(users2)
  }, 1000)
  
  const addConnection = async (data: {connections: ConnectionData[]}) => {
    console.log(data) 
      const response = await fetch(`${connectionUrl}/api/v1/addConnection`, {
      method: "POST", 
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if(!response.ok){
      alert("Failed to add connection");
    }
    else{
      const data = await response.json();
      if(data.present){
        alert("Connection already exists");
      }
      else{
        alert("Connection added successfully");
      }
    }
  
    return response.json();
  };

  const handleAddConnection = () => {
    if (!mainUserEmail.current?.value || !conUserEmail.current?.value || !mainUserName.current?.value || !conUserName.current?.value || !connection.current?.value || !connectionType) {
      alert("Please fill in all required fields");
      return;
    }
    if(localStorage.getItem("token")==null){
      alert("Please login to add connection");
      return;

    }

    let Connections=[]
    
    Connections.push({mainUserEmail:mainUserEmail.current.value, mainUserName:mainUserName.current.value, conUserEmail:conUserEmail.current.value, conUserName:conUserName.current.value, connection:connection.current.value})
    console.log(Connections)
    addConnection({connections:Connections});
  };

  // send a data to backend instead of file


  const handleUploadFile = async() => {
    const file = fileInput.current?.files?.[0];

    console.log(file)
    if (!file) {
      alert("Please select a file to upload");
      console.log("no file")
      return;
    }
  
    try{
      const data: any = await validateJSONFile(file);
      
      console.log("data")
      console.log(data);
      addConnection(data);
    }
    catch(error){
      alert("Error in file");
    }
  }

  const validateJSONFile = (file: File) => {
    return new Promise((resolve, reject) => {
      if (file.type !== "application/json") {
        return reject("Invalid file type. Please upload a JSON file.");
      }
  
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const json = JSON.parse(event?.target?.result as string);
          
          // Check if "connections" object exists
          if (!json.connections || !Array.isArray(json.connections)) {
            return reject("Invalid JSON structure. Expected 'connections' as an array.");
          }
  
          // Additional schema validation (example)
          const isValid=   json.connections.some((connection: any) => {
            !connection.mainUserEmail || !connection.conUserEmail || !connection.mainUserName || !connection.conUserName || !connection.connection
           
       
         })
     
         if(isValid){
           reject("Invalid connection");
           return;
         }
          resolve(json);
        } catch (error) {
          reject("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    });
  };


  
  

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      
      {localStorage.getItem("token") ? (
        <div className="py-6 sm:py-12 flex items-center justify-center bg-gray-100 px-4 sm:px-6">
          <div className="w-full max-w-[600px] bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">Add Connection</h1>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="material-symbols-outlined cursor-pointer transform hover:scale-110 transition-transform duration-300"
              >
                <IoIosClose />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <input
                  ref={mainUserEmail}
                  onChange={(e) => {
                  setLoading(true)
                  searchuser(e.target.value, "1")
                   


                  }}
                  type="email"
                  placeholder="Email Address (required)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                />
                
                <span className="material-symbols-outlined absolute right-3 top-3">
                  <CiMail />
                </span>
                {loading && 
                  <div className=" w-auto  h-max my-2 border-2 bg-gray-300 ">
                   Searching...
                  </div>
                }
                {!loading && users.length > 0 && (
                  <div className="w-full h-max my-2 border-2 bg-gray-300 p-2">
            <ul>
              { 
              users.map((conn, index) => (
                <li onClick={() => {
                  setSelectedUser(conn)
                  console.log(selecteduser)
                  if (mainUserEmail?.current) {
                    mainUserEmail.current.value = conn.email
                  }
                  if (mainUserName?.current) {
                    mainUserName.current.value = conn.username
                  }

                  setUsers([])
                }} key={index}>{conn.email}</li>
              ))}
            </ul>
          </div>
          )}
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
                  onChange={(e) =>
                  {
                    setLoading2(true)
                    searchuser(e.target.value, "2")
                  }}
                  type="email"
                  placeholder="Connection Email (required)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                />
                <span className="material-symbols-outlined absolute right-3 top-3">
                  <MdOutlineBadge />
                </span>
              </div>
              {loading2 && 
                  <div className=" w-auto  h-max my-2 border-2 bg-gray-300 ">
                   Searching...
                  </div>
                }
                {!loading2 && users2.length > 0 && (
                      <div className="w-full h-max my-2 border-2 bg-gray-300 p-2">
            <ul>
              { 
              users2.map((conn, index) => (
                <li onClick={() => {
                  setSelectedUser2(conn)
                  console.log(selecteduser2)
                  if (conUserEmail?.current) {
                    conUserEmail.current.value = conn.email
                  }
                  if (conUserName?.current) {
                    conUserName.current.value = conn.username
                  }

                  setUsers2([])
                }} key={index}>{conn.email}</li>
              ))}
            </ul>
          </div>
          )}

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

              <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div>
                  <p className="text-lg sm:text-xl">Connection Type</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-16 sm:ml-4">
                  <div className="flex items-center gap-0.5">
                    <input
                      type="radio"
                      name="connectionType"
                      value="direct"
                      onChange={() => 
                      {
                        setConnectionType("Normal")
                        if(connection.current) {
                          connection.current.value = ""
                          connection.current.disabled = false
                          connection.current.style.backgroundColor =  "white"
                        }
                      }}
                      // onChange={() => setConnectionType("direct")}
                    />
                    <label  className="mx-2" htmlFor="direct">Normal</label>
                  </div>

                  <div className="flex items-center py-2 gap-0.5">
                    <input
                      type="radio"
                      name="connectionType"
                      value="indirect"
                      onChange={() => 
                      {
                        setConnectionType("Workplace")
                        if(connection.current) {
                          connection.current.value = "Workplace"
                          connection.current.disabled = true
                          connection.current.style.backgroundColor =  "gray"
                        }
                        console.log(connection)
                        console.log(connectionType)
                      }}
                      // checked={connectionType === "indirect"}
                      // onChange={() => setConnectionType("indirect")}
                    />
                    <label className="mx-2" htmlFor="indirect">Workplace</label>
                  </div>
                </div>
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

            
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }} 
                  className="w-full sm:w-auto px-6 py-3 border rounded-lg hover:bg-gray-50 transform hover:scale-105 duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddConnection();
                  }} 
                  className="w-full sm:w-44 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
                >
                  Add Connection
                </button>
              </div>

              <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-2">info</span>
                  <p className="text-xs sm:text-sm">
                    Current connections will appear in the visualizer after being added
                  </p>
                </div>
              </div>

              <div className="mt-4 p-2 sm:p-4">
                <p className="text-lg text-center">or</p>
              </div>
              <div>
                <div className="mt-1 p-1 text-xl sm:text-2xl font-bold">
                  Upload Json Connections File
                </div>
                <div className="mt-1 p-1 flex flex-col sm:flex-row items-center gap-2 sm:justify-between">
                  <input
                    ref={fileInput}
                    className="w-full sm:w-auto border p-2 mt-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    type="file"
                    accept=".json"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUploadFile();
                    }}
                    className="w-full sm:w-44 p-2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Wrapper />
      )}
    </div>
  );
};
