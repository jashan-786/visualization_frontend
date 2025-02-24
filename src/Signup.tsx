import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import { BsPass } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { connectionUrl } from "./utils/connectionUrl";
export const Signup = () => {
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  console.log(username.current?.value);
  console.log(email.current?.value);
  console.log(password.current?.value);
  function onClickHandler() {
    console.log("cli");
    async function fetch() {
      const response = await axios.post(
            `${connectionUrl}/api/v1/signup`,
        {
          username: username.current?.value,
          email: email.current?.value,
          password: password.current?.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      if (response.data.message === "user created successfully") {
        alert("User created successfully");
        navigate("/signin");
      } else {
        alert("User not created");
      }
    }

    fetch();
  }

  return (
    <>
      <Header />
      <div id="webcrumbs">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[320px] sm:max-w-[380px] md:max-w-md p-4 sm:p-6 md:p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Sign Up</h1>
              <span className="material-symbols-outlined text-1xl cursor-pointer hover:rotate-180 transition-transform duration-300">
                <IoClose onClick={() => navigate("/")} />
              </span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="relative">
                <input
                  ref={username}
                  type="text"
                  placeholder="User Name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                />
                <span className="material-symbols-outlined absolute right-3 top-2 sm:top-3">
                  <IoMdPerson />
                </span>
              </div>

              <div className="relative">
                <input
                  ref={email}
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                />
                <span className="material-symbols-outlined absolute right-3 top-2 sm:top-3">
                  <CiMail />
                </span>
              </div>

              <div className="relative">
                <input
                  ref={password}
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                />
                <span className="material-symbols-outlined absolute right-3 top-2 sm:top-3">
                  <CiLock />
                </span>
              </div>

              <button
                onClick={onClickHandler}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Account
              </button>

              <div className="relative flex items-center gap-3 sm:gap-4 my-6 sm:my-8">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="text-xs sm:text-sm text-gray-500">or continue with</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <p className="text-center text-xs sm:text-sm">
                Already have an account?
                <a onClick={() => navigate("/signin")} className="font-semibold ml-1 hover:underline hover:cursor-pointer">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
