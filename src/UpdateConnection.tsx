import { IoIosClose } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { MdOutlineBadge } from "react-icons/md";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { connectionUrl } from "./utils/connectionUrl";
export const UpdateConnection = () => {
  const [entityType, setEntityType] = useState("Normal");

  const onClickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const prevEmail = prevEmailRef.current?.value;
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const description = descriptionRef.current?.value;

    try {
      const response = await axios.post(
        `${connectionUrl}/api/v1/updateUser`,
        { prevEmail, email, username, description, entityType },
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
  const navigate = useNavigate();
  const prevEmailRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const resetHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (prevEmailRef.current) prevEmailRef.current.value = "";
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
                      <input
                        type="email"
                        ref={prevEmailRef}
                        placeholder="Previous Email Address (required)"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2 sm:top-3">
                        <CiMail />
                      </span>
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
                    </div>

                    <div className="relative">
                      <textarea
                        ref={descriptionRef}
                        placeholder="Description"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 h-24 sm:h-32 resize-none"
                      />
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
