import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { set, z } from "zod";
import Wrapper from "../../components/Wrapper";
import Header from "../../components/Header";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { searchUser } from "../../utils/helper";
import axios from "axios";
import { connectionUrl } from "../../utils/connectionUrl";

export const DeleteUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchfnc = useCallback(
    (
      query: string,
      type: "username" | "email" | "phonenumber",
      setState: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      const res = searchUser(query, type, setState);
      console.log(res);
    },
    []
  );

  const [selectedOption, setSelectedOption] = useState<
    "phonenumber" | "email" | "username"
  >("phonenumber");
  const [fieldValue, setFieldValue] = useState<string>("");
  const [error, setErrors] = useState<{ [Key: string]: string }>({});
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const formObject = z.object({
    userName: z.string().min(1, "Username is required"), // Added min(1) to ensure it's not empty
    email: z.string().email("Invalid email format"),
    phone: z
      .string()
      .regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Invalid phone format"),
  });

  const validateField = (
    value: string,
    field: keyof typeof formObject.shape
  ) => {
    try {
      const key = formObject.shape[field];
      key.parse(value);
      setErrors({}); // Clear error for the field
      return false; // No error
    } catch (error) {
      console.error("Validation Error:", error);
      const errorMessages: { [Key: string]: string } = {};

      (error as z.ZodError).errors.forEach((error) => {
        errorMessages["message"] = error.message;
      });

      console.log(errorMessages);
      setErrors(errorMessages);
      return true;
    }
  };
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  };
  const onClickHandler = async () => {
    // const email = emailRef.current?.value || "";

    try {
      const res = validateField(fieldValue, selectedOption === "username" ? "userName" : selectedOption === "email" ? "email" : "phone");
     if(res){
        alert("Please enter a valid " + selectedOption);
        return; // Stop execution if validation fails
     }
      if(!res){ await fetch(
        `${connectionUrl}/api/v1/deleteuser`,
        {
          method: "POST",
            body: JSON.stringify({
                id: currentUser?._id,
            }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then(async (response) => {
          console.log("done");
          const data = await response.json();
        
          console.log(data);
          setSearchedUsers([]);
          setCurrentUser(null);
            if(data.message) {
              alert(data.message);
            }
        })
        .catch(() => {
          console.log("no results found");
            alert("No user found with the provided details.");
        });

    setErrors({});
    }   
} catch (err) {
      if (err instanceof z.ZodError) {
        console.log("Validation Errors:", err.errors);

        return; //  Stop execution if validation fails
      }
    
    }
    
    
  }

  const resetHandler = () => {
    setFieldValue("");
    setSearchedUsers([]);
    setCurrentUser(null);
    setErrors({});
  };

  return (
    <div>
      <div className=" flex flex-col justify-between">
        <Header />

        {localStorage.getItem("token") ? (
          <div className="py-8 md:py-12 flex items-center justify-center bg-gray-100 min-h-screen px-4">
            <div className="w-full max-w-[95%] md:max-w-[600px] bg-white flex flex-col rounded-lg shadow-lg p-4 md:p-8">
              <div className="flex items-center flex-col justify-between mb-4 md:mb-6">
                <div className="flex items-center justify-between py-2 md:py-4 w-full">
                  <h1 className="text-xl md:text-2xl font-bold">
                    {t("Delete User")}
                  </h1>
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
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-1">

                       <input
                        type="radio"
                        checked={selectedOption === "phonenumber"}
                        onChange={() => {
                          setSelectedOption("phonenumber");
                          setErrors({});
                        }}
                        value="Phonenumber"
                      />

                      <label className="text-sm font-medium text-gray-700">
                        {t("Phone Number")}
                      </label>
                     
                    </div>

                    <div className="flex items-center gap-1">

                          <input
                        type="radio"
                        checked={selectedOption === "username"}
                        onChange={() => {
                          setSelectedOption("username");
                          setErrors({});
                        }}
                        value="Username"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        {t("Username")}
                      </label>
                  
                    </div>

                    <div className="flex items-center gap-1">

                        <input
                        type="radio"
                        checked={selectedOption === "email"}
                        onChange={() => {
                          setSelectedOption("email");
                          setErrors({});
                        }}
                        value="Email"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        {t("Email")}
                      </label>
                    
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-full max-w-sm">
                        <div className="relative ">
                          {selectedOption === "phonenumber" && (
                            <input
                              type="text"
                              id="phone-input"
                              aria-describedby="helper-text-explanation"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              placeholder="123-456-7890"
                              value={fieldValue}
                              onChange={(e) => {
                                setFieldValue(e.target.value);
                                searchfnc(
                                  e.target.value,
                                  "phonenumber",
                                  setSearchedUsers
                                );
                              }}
                            />
                          )}
                          {selectedOption === "username" && (
                            <input
                              type="text"
                              id="username-input"
                              value={fieldValue}
                              aria-describedby="helper-text-explanation"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="John doe"
                              onChange={(e) => {
                                setFieldValue(e.target.value);
                          
                                searchfnc(
                                  e.target.value,
                                  "username",
                                  setSearchedUsers
                                );
                                console.log(searchedUsers);
                              }}
                            />
                          )}

                          {selectedOption === "email" && (
                            <input
                              type="text"
                              id="email-input"
                              value={fieldValue}
                              aria-describedby="helper-text-explanation"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Johndoe@gmail.com"
                              onChange={(e) => {
                                setFieldValue(e.target.value);

                                searchfnc(
                                  e.target.value,
                                  "email",
                                  setSearchedUsers
                                );
                              }}
                            />
                          )}

                          {searchedUsers.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto">
                              {searchedUsers.map((user) => (
                                <li
                                  key={user.id}
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setFieldValue(
                                      selectedOption === "username"
                                        ? user.username
                                        : selectedOption === "email"
                                        ? user.email
                                        : user.phoneNumber
                                    );

                                    setSearchedUsers([]);
                                  }}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                >
                                  {selectedOption === "username"
                                    ? user.username
                                    : selectedOption === "email"
                                    ? user.email
                                    : user.phoneNumber}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
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
                      {t("Delete User")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        resetHandler();
                      }}
                      className="w-full sm:flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      {t("Reset")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <Wrapper />
        )}
      </div>
    </div>
  );
};
