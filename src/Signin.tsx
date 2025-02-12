import axios from "axios";
import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export const Signin = () => {
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  async function onClickHandler(event: React.FormEvent) {
    event.preventDefault();

    console.log(email.current?.value);
    console.log(password.current?.value);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/signin",
        {
          email: email.current?.value,
          password: password.current?.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.headers);
      localStorage.setItem("token", response.data.token);
      console.log(response.data);

      alert("User signed in");
    } catch (error) {
      alert("User not signed in");
    }
  }

  return (
    <div className=" overflow-hidden">
      <div className="min-h-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
          <div className="p-8">
            <div className="text-center mb-8  flex items-center justify-between">
              {/* <div className="material-symbols-outlined text-5xl text-indigo-600 mb-10">
                Connection Visualizer
              </div> */}
              <h2 className="text-2xl font-bold">Sign in to your account</h2>
              <span className="material-symbols-outlined text-1xl cursor-pointer hover:rotate-180 transition-transform duration-300">
              <IoClose  onClick={() => navigate("/")}/>
            </span>
            </div>

            <form onSubmit={onClickHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  ref={email}
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  ref={password}
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              {/* // remember me checkbox + forgot password  */}
              {/* 
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200"
                  />
                  <label className="ml-2 block text-sm">Remember me</label>
                </div>
                <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Forgot password?
                </a>
              </div> */}

              <button className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200">
                Sign in
              </button>
            </form>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div> */}

            <p className="mt-6 text-center text-sm">
              Not a member yet?
              <a onClick= {() => navigate("/signup")} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 transition-colors duration-200 hover:cursor-pointer">
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
