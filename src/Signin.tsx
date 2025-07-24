import axios from "axios";
import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { connectionUrl } from "./utils/connectionUrl";
import { useTranslation } from "react-i18next";
export const Signin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  async function onClickHandler(event: React.FormEvent) {
    event.preventDefault();

    console.log(email.current?.value);
    console.log(password.current?.value);
    try {   
      const response = await axios.post(  
        `${connectionUrl}/api/v1/signin`,
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
      navigate("/visualize");
    } catch (error) {
      alert("User not signed in");
    }
  }

  return (
    <>
      <Header />
      <div className="overflow-hidden">
        <div className="min-h-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8">
          <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 sm:mb-8 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold"> {t("Sign in to your account")}</h2>
                <span className="material-symbols-outlined text-1xl cursor-pointer hover:rotate-180 transition-transform duration-300">
                  <IoClose onClick={() => navigate("/")} />
                </span>
              </div>

              <form onSubmit={onClickHandler} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 sm:mb-2">
                    {t("Email address")}
                  </label>
                  <input
                    ref={email}
                    type="email"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder={t("Enter your email")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 sm:mb-2">
                    {t("Password")}
                  </label>
                  <input
                    ref={password}
                    type="password"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder={t("Enter your password")}
                  />
                </div>


                <button className="w-full py-2 sm:py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200">
                  {t("Sign in")}
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

              <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
                {t("Not a member yet?")}
                <a onClick={() => navigate("/signup")} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 transition-colors duration-200 hover:cursor-pointer">
                  {t("Sign up now")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
