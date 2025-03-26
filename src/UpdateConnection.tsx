import { IoIosClose } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { MdOutlineBadge } from "react-icons/md";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { connectionUrl } from "./utils/connectionUrl";
import { z } from "zod";

const formObject = z.object({

email: z.string().email("Invalid email format"),
  prevphone: z.string().regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, "Invalid phone format"),
  newphone: z.string().regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, "Invalid phone format"),
  entityType: z.string(),
  description: z.string().min(1, "Description is required"),
  username: z.string().min(1, "Username is required"),
});

export const UpdateConnection = () => {
  const navigate = useNavigate();
  const prevPhoneRef = useRef<HTMLInputElement>(null);
  const newPhoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);


  const [entityType, setEntityType] = useState("Normal");

  const [errors, setErrors] = useState<{ [Key: string]: string }>({});

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const prevPhone = prevPhoneRef.current?.value;
    const newPhone = newPhoneRef.current?.value;
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const description = descriptionRef.current?.value;

    try {
       formObject.parse({
        email: email,
        prevphone: prevPhoneRef.current?.value ,
        newphone: newPhoneRef.current?.value ,
        entityType: entityType,
        description: description,
        username: username,
      });

      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((error) => {

          setErrors((prev) => ({
            ...prev,
            [error.path[0]]: error.message,
          }));

        })
      }

      console.log(errors);
return;
    }

    try {
      const response = await axios.post(
        `${connectionUrl}/api/v1/updateUser`,
        { prevPhone, newPhone, email, username, description, entityType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.user) {
        alert("User updated successfully");
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update user");
    }
  };

  const resetHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (prevPhoneRef.current) prevPhoneRef.current.value = "";
    if (newPhoneRef.current) newPhoneRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (usernameRef.current) usernameRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {localStorage.getItem("token") ? (
        <div className="flex-1 bg-gray-100 p-3 sm:p-6 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] bg-white rounded-lg shadow-lg">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-bold">Update User</h1>
                  <span className="material-symbols-outlined cursor-pointer text-xl sm:text-2xl transform hover:scale-110 transition-transform duration-300">
                    <IoIosClose onClick={() => navigate("/")} />
                  </span>
                </div>

                <form className="space-y-4 sm:space-y-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative">
                      <div className="w-full max-w-sm">
                        <label
                          htmlFor="phone-input"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Old Phone number:
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
                            ref={prevPhoneRef}
                            type="text"
                            id="phone-input"
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder="123-456-7890"
                            required
                          />
                        </div>
                        <p
                          id="helper-text-explanation"
                          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                          Select a phone number that matches the format.
                        </p>
                      </div>

                      {errors.prevphone && (
                        <p className="text-red-500 text-sm">{errors.prevphone}</p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="w-full max-w-sm">
                        <label
                          htmlFor="phone-input"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          New Phone number:
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
                            ref={newPhoneRef}
                            type="text"
                            id="phone-input"
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder="123-456-7890"
                            required
                          />
                        </div>
                        <p
                          id="helper-text-explanation"
                          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                          Select a phone number that matches the format.
                        </p>
                      </div>

                      {errors.newphone && (
                        <p className="text-red-500 text-sm">{errors.newphone}</p>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        ref={emailRef}
                        placeholder="New Email Address (required)"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2 sm:top-3">
                        <CiMail />
                      </span>
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>)}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        ref={usernameRef}
                        placeholder="New Username (required)"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2 sm:top-3">
                        <MdOutlineBadge />
                      </span>

                      {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                      )}
                    </div>

                    <div className="relative">
                      <textarea
                        ref={descriptionRef}
                        placeholder="Description"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 h-24 sm:h-32 resize-none"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                      )}
                    </div>

                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div>
                        <p className="text-lg sm:text-xl">Enity Type</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:gap-16 sm:ml-4">
                        <div className="flex items-center gap-0.5">
                          <input
                            type="radio"
                            name="entityType"
                            defaultChecked
                            onChange={() => {
                              console.log(entityType);
                              setEntityType("Normal");
                            }}
                            // onChange={() => setConnectionType("direct")}
                          />
                          <label className="mx-2" htmlFor="direct">
                            Normal
                          </label>
                        </div>

                        <div className="flex items-center py-2 gap-0.5">
                          <input
                            type="radio"
                            name="entityType"
                            value="indirect"
                            onChange={() => {
                              console.log(entityType);
                              setEntityType("Workplace");
                            }}
                            // checked={connectionType === "indirect"}
                            // onChange={() => setConnectionType("indirect")}
                          />
                          <label className="mx-2" htmlFor="indirect">
                            Workplace
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={onClickHandler}
                      className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      Update Connection
                    </button>
                    <button
                      onClick={resetHandler}
                      className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      Reset
                    </button>
                  </div>
                </form>
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

export default UpdateConnection;
