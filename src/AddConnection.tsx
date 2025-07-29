import { MdOutlineBadge } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import {  useRef, useState } from "react";
import Wrapper from "./components/Wrapper";
import { connectionUrl } from "./utils/connectionUrl";
import { z } from "zod";
import { useCallback } from "react";

import { useTranslation } from "react-i18next";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export interface ConnectionData {
  mainPhone: string;
  mainUserEmail: string;
  mainUserName: string;
  conPhone: string;
  conUserEmail: string;
  conUserName: string;
  connection: string;
  entityType: string;
}

export const formObject = z.object({
  mainemail: z.string().email("Invalid email format").optional(),
  conemail: z.string().email("Invalid email format").optional(),
  mainphone: z
    .string()
    .regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Invalid phone format"),
  conphone: z
    .string()
    .regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Invalid phone format"),
  entityType: z.string().min(1, "Connection type is required"),
  connection: z.string().min(1, "Connection is required"),
  mainusername: z.string().min(1, "Username is required").optional(),
  conusername: z.string().min(1, "Username is required").optional(),
});

export const addConnection = async (data: {
  connections: ConnectionData[];
}) => {
  console.log(data);
  const response = await fetch(`${connectionUrl}/api/v1/addConnection`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    alert("Failed to add connection");
  } else {
    const data = await response.json();
    if (data.present) {
      return data;
      alert("Connection already exists");
    } else {
      alert("Connection added successfully");
    }
  }
};

export const AddConnection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mainUserEmail = useRef<HTMLInputElement>(null);
  const conUserEmail = useRef<HTMLInputElement>(null);
  const mainUserName = useRef<HTMLInputElement>(null);
  const conUserName = useRef<HTMLInputElement>(null);
  const connection = useRef<HTMLInputElement>(null);
  const mainPhoneRef = useRef<HTMLInputElement>(null);
  const conPhoneRef = useRef<HTMLInputElement>(null);

  const [selecteduser, setSelectedUser] = useState<any | null>({});
  const [selecteduser2, setSelectedUser2] = useState<any | null>({});

  const fileInput = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [users2, setUsers2] = useState<any[]>([]);
  const [showExtraUser1Fields, setShowExtraUser1Fields] = useState({
    email: false,
    username: false,
  });
  const [showExtraUser2Fields, setShowExtraUser2Fields] = useState({
    email: false,
    username: false,
  });
 
  const [connectionType, setConnectionType] = useState<string>("Normal");

  const [errors, setErrors] = useState<{ [Key: string]: string }>({});

  const searchuser = useCallback(
    debounce(async (phoneNumber: string, loadingValue: string) => {
      console.log("true");
      console.log(phoneNumber);
      await fetch(
        `${connectionUrl}/api/v1/user-info?phoneNumber=${phoneNumber}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then(async (response) => {
          console.log("done");
          if (loadingValue == "1") {
            setLoading(false);
          } else {
            setLoading2(false);
          }
          const data = await response.json();
          console.log(data);
          if (loadingValue == "1") {
            let newUsers = [];
            if (data.user.length > 0) {
              newUsers.push(data.user);
              setSelectedUser(data.user[0]);
            } else {
              setSelectedUser(null);
            }
            setUsers(newUsers);

            console.log("users length", newUsers.length);
          } else {
            let newUsers2 = [];
            console.log("users2 length", newUsers2.length);

            if (data.user.length > 0) {
              newUsers2.push(data.user);
              setSelectedUser2(data.user[0]);
            } else {
              setSelectedUser2(null);
            }
            setUsers2(newUsers2);
          }
        })
        .catch(() => {
          console.log("no results found");
          setTimeout(() => setLoading(false), 500);
        });
    }, 3000),
    []
  );

  const handleAddConnection = () => {

   

    try {
    const result= formObject.safeParse({
        mainemail:  mainUserEmail.current ? mainUserEmail.current.value : selecteduser ? selecteduser.email : "",
        conemail:  conUserEmail.current ? conUserEmail.current.value : selecteduser2 ? selecteduser2.email : "",
        mainphone:  mainPhoneRef.current ? mainPhoneRef.current.value : selecteduser.phone,
        conphone:  conPhoneRef.current ? conPhoneRef.current.value : selecteduser2.phone,
        entityType: connectionType,
        connection: connection.current?.value,
        mainusername:  mainUserName.current ? mainUserName.current.value : selecteduser ? selecteduser.username : "",
        conusername:conUserName.current ? conUserName.current.value : selecteduser2 ? selecteduser2.username : "",
      });

      if(result.error){
          result.error.errors.map((error) => {
          setErrors((prev) => {
            return { ...prev, [error.path[0]]: error.message };
          });
        });
      }



      
    } catch (error) {
      if (error instanceof z.ZodError) {
      
        console.log(error.errors);
        return;
      }
    }

    let Connections = [];

    Connections.push({
      mainPhone: mainPhoneRef.current ? mainPhoneRef.current.value : selecteduser.phone,
      conPhone: conPhoneRef.current ? conPhoneRef.current.value : selecteduser2.phone,
      mainUserEmail: mainUserEmail.current ? mainUserEmail.current.value : selecteduser ? selecteduser.email : "",
      mainUserName: mainUserName.current ? mainUserName.current.value : selecteduser ? selecteduser.username : "",
      conUserEmail: conUserEmail.current ? conUserEmail.current.value : selecteduser2 ? selecteduser2.email : "",
      conUserName: conUserName.current ? conUserName.current.value : selecteduser2 ? selecteduser2.username : "",
      connection: connection.current ? connection.current.value : "",
      entityType: connectionType,
    });

   


    console.log(Connections);
    addConnection({ connections: Connections });

    setErrors({});
  };

  // send a data to backend instead of file

  const handleUploadFile = async () => {
    const file = fileInput.current?.files?.[0];

    console.log(file);
    if (!file) {
      alert("Please select a file to upload");
      console.log("no file");
      return;
    }

    try {
      const data: any = await validateJSONFile(file);

      console.log("data");
      console.log(data);
      addConnection(data);
    } catch (error) {
      alert("Error in file");
    }
  };

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
            return reject(
              "Invalid JSON structure. Expected 'connections' as an array."
            );
          }

          // Additional schema validation (example)
          const isValid = json.connections.some((connection: any) => {
            !connection.mainPhone ||
              !connection.conPhone ||
              !connection.mainUserEmail ||
              !connection.conUserEmail ||
              !connection.mainUserName ||
              !connection.conUserName ||
              !connection.connection;
          });

          if (isValid) {
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
        <div className="py-6  sm:py-12 flex items-center justify-center bg-gray-100 px-4 sm:px-6">
          <div className="w-full max-w-[600px] bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <div className="flex  items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">{t("Add Connection")}</h1>
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

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div>
                <p className="text-lg sm:text-xl">{t("Connection Type")}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-16 sm:ml-4">
                <div className="flex items-center gap-0.5">
                  <input
                    type="radio"
                    name="connectionType"
                    value="direct"
                    defaultChecked
                    onChange={() => {
                      setConnectionType("Normal");
                      if (connection.current) {
                        connection.current.value = "";
                        connection.current.disabled = false;
                        connection.current.style.backgroundColor = "white";
                      }

                      console.log(connection);
                      console.log(connectionType);
                    }}
                    // onChange={() => setConnectionType("direct")}
                  />
                  <label className="mx-2" htmlFor="direct">
                   {t("Normal")}
                  </label>
                </div>

                <div className="flex items-center py-2 gap-0.5">
                  <input
                    type="radio"
                    name="connectionType"
                    value="indirect"
                    onChange={() => {
                      setConnectionType("Workplace");
                      if (connection.current) {
                        connection.current.value = "Workplace";
                        connection.current.disabled = true;
                        connection.current.style.backgroundColor = "gray";
                      }
                      console.log(connection);
                      console.log(connectionType);
                    }}
                    // checked={connectionType === "indirect"}
                    // onChange={() => setConnectionType("indirect")}
                  />
                  <label className="mx-2" htmlFor="indirect">
                   {t("Workplace")}
                  </label>
                </div>
              </div>
              {errors.connection && (
                <p className="text-red-500 text-sm">{errors.entityType}</p>
              )}
            </div>

            <div className="relative">
              <div className="w-full max-w-sm">
                <label
                  htmlFor="phone-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("Main Phone number:")}
                </label>
                <div className="relative ">
                  <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 19 18"
                    >
                      <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                    </svg>
                  </div>
                  <input
                    ref={mainPhoneRef}
                    type="text"
                    id="phone-input"
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-456-7890"
                    required
                    onChange={(e) => {
                      setUsers([]);
                      setLoading(true);
                      searchuser(e.target.value, "1");
                    }}
                  />
                </div>
                <p
                  id="helper-text-explanation"
                  className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  {t("Put a phone number that matches the format.")}
                </p>

                {loading ? (
                  <div className=" w-auto  h-max my-2 border-2 bg-gray-300 ">
                    {t("Searching...")}
                  </div>
                ) : users.length > 0 ? (
                  <div className="w-full h-max my-2 border-2 bg-gray-300 p-2">
                    <ul>
                      {users.map((user, index) => {
                        return (
                          <li
                            onClick={() => {
                              setSelectedUser(user[0]);
                              console.log(user[0]);
                              if (mainUserEmail?.current) {
                                console.log(user[0].email);
                                mainUserEmail.current.value = user[0].email;
                              }
                              if (mainUserName?.current) {
                                mainUserName.current.value = user[0].username;
                              }

                              setUsers([]);
                            }}
                            key={index}
                          >
                            {user[0].phoneNumber}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              {errors.mainphone && (
                <p className="text-red-500 text-sm">{errors.mainphone}</p>
              )}
            </div>

            <div className="space-y-5 my-4 sm:space-y-6">
              {selecteduser == null && (
                <>
                  <p className="text-gray-500 text-sm">
                    {t("Please select the information for the user.")}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked
                          ? setShowExtraUser1Fields((prev) => ({
                              ...prev,
                              email: true,
                            }))
                          : setShowExtraUser1Fields((prev) => ({
                              ...prev,
                              email: false,
                            }));
                      }}
                    />
                    <label className="text-gray-500 text-sm">{t("Add Email")}</label>

                    <input
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked
                          ? setShowExtraUser1Fields((prev) => ({
                              ...prev,
                              username: true,
                            }))
                          : setShowExtraUser1Fields((prev) => ({
                              ...prev,
                              username: false,
                            }));
                      }}
                    />
                    <label className="text-gray-500">{t("Add Username")}</label>
                  </div>
                </>
              )}

              <>
                {/* Main email input */}
                {showExtraUser1Fields.email && (
                  <div className="relative">
                    <input
                      ref={mainUserEmail}
                      type="email"
                      placeholder={t("Email Address (required)")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />

                    <span className="material-symbols-outlined absolute right-3 top-3">
                      <CiMail />
                    </span>

                    {errors.mainemail && (
                      <p className="text-red-500 text-sm">{errors.mainemail}</p>
                    )}
                  </div>
                )}
                {/* Main username input */}

                {showExtraUser1Fields.username && (
                  <div className="relative">
                    <input
                      ref={mainUserName}
                      type="text"
                      placeholder={t("Main Username (required)")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3">
                      <CiMail />
                    </span>
                    {errors.mainusername && (
                      <p className="text-red-500 text-sm">
                        {errors.mainusername}
                      </p>
                    )}
                  </div>
                )}
              </>

              <div className="relative">
                <div className="w-full max-w-sm">
                  <label
                    htmlFor="phone-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("Connection Phone number:")}
                  </label>
                  <div className="relative ">
                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 19 18"
                      >
                        <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                      </svg>
                    </div>
                    <input
                      ref={conPhoneRef}
                      type="text"
                      id="phone-input"
                      aria-describedby="helper-text-explanation"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                      placeholder="123-456-7890"
                      required
                      onChange={(e) => {
                        setLoading2(true);
                        searchuser(e.target.value, "2");
                      }}
                    />
                  </div>
                  <p
                    id="helper-text-explanation"
                    className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {t("Put a phone number that matches the format.")}
                  </p>
                </div>

                {errors.conphone && (
                  <p className="text-red-500 text-sm">{errors.conphone}</p>
                )}
                {loading2 ? (
                  <div className=" w-auto  h-max my-2 border-2 bg-gray-300 ">
                    {t("Searching...")}
                  </div>
                ) : users2.length > 0 ? (
                  <div className="w-full h-max my-2 border-2 bg-gray-300 p-2">
                    <ul>
                      {users2.map((user, index) => {
                        return (
                          <li
                            onClick={() => {
                              setSelectedUser2(user[0]);
                              console.log(selecteduser2);
                              if (mainUserEmail?.current) {
                                mainUserEmail.current.value = user[0].email;
                              }
                              if (mainUserName?.current) {
                                mainUserName.current.value = user.username;
                              }

                              setUsers2([]);
                            }}
                            key={index}
                          >
                            {user[0].phoneNumber}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <></>
                )}
              </div>
           
              {selecteduser2 == null && (
                <>
                  <p className="text-gray-500 text-sm">
                    {t("Please select the information for the user.")}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked
                          ? setShowExtraUser2Fields((prev) => ({
                              ...prev,
                              email: true,
                            }))
                          : setShowExtraUser2Fields((prev) => ({
                              ...prev,
                              email: false,
                            }));
                      }}
                    />
                    <label className="text-gray-500 text-sm">{t("Add Email")}</label>

                    <input
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked
                          ? setShowExtraUser2Fields((prev) => ({
                              ...prev,
                              username: true,
                            }))
                          : setShowExtraUser2Fields((prev) => ({
                              ...prev,
                              username: false,  
                            }));
                      }}
                    />
                    <label className="text-gray-500">{t("Add Username")}</label>
                  </div>
                </>
              )}
              <>
                {/* connection email input */}
                {showExtraUser2Fields.email && (
                  <div className="relative">
                    <input
                      ref={conUserEmail}
                      type="email"
                      placeholder={t("Email Address (required)")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />

                    <span className="material-symbols-outlined absolute right-3 top-3">
                      <CiMail />
                    </span>

                    {errors.conemail && (
                      <p className="text-red-500 text-sm">{errors.conemail}</p>
                    )}
                  </div>
                )}
                {/* connection username input */}

                {showExtraUser2Fields.username && (
                  <div className="relative">
                    <input
                      ref={conUserName}
                      type="text"
                      placeholder={t("Main Username (required)")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3">
                      <CiMail />
                    </span>
                    {errors.conusername && (
                      <p className="text-red-500 text-sm">
                        {errors.conusername}
                      </p>
                    )}
                  </div>
                )}
              </>

              <div className="relative">
                <input
                  ref={connection}
                  type="text"
                  placeholder={t("Connection Type (required)")}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                />
                <span className="material-symbols-outlined absolute right-3 top-3">
                  <MdOutlineBadge />
                </span>
                {errors.connection && (
                  <p className="text-red-500 text-sm">{errors.connection}</p>
                )}
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
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddConnection();
                  }}
                  className="w-full sm:w-44 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
                >
                  {t("Add Connection")}
                </button>
              </div>

              <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-2">{t("info")}: </span>
                  <p className="text-xs sm:text-sm">
                    {t("Current connections will appear in the visualizer after being added")}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-2 sm:p-4">
                <p className="text-lg text-center">{t("or")}</p>
              </div>
              <div>
                <div className="mt-1 p-1 text-xl sm:text-2xl font-bold">
                  {t("Upload Json Connections File")}
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
                    {t("Upload File")}
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
