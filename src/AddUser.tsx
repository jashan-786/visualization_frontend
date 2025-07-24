import { useRef, useState } from "react";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Wrapper from "./components/Wrapper";
import { IoIosClose } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { connectionUrl } from "./utils/connectionUrl";
import {z} from "zod";
import { useTranslation } from "react-i18next";
const formObject = z.object({
  userName: z.string().min(1, "Username is required"), // Added min(1) to ensure it's not empty
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, "Invalid phone format"),
  entityType: z.string(),
  description: z.string().min(1, "Description is required"),
});

export default function AddUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [entityType, setEntityType] = useState<string>("Normal");


  const [error , setErros]= useState<{ [Key: string] : string}>({});

  const onClickHandler = async () => {
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const description = descriptionRef.current?.value;
    const phone = phoneRef.current?.value;

    try {
      // First, validate input using Zod
      const res = formObject.parse({
        userName: username,
        email: email,
        phone: phone,
        entityType: entityType,
        description: description,
      });
      console.log(res);

      setErros({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log("Validation Errors:", err.errors);
        
        const errorMessages: { [Key: string] : string} = {};

        err.errors.forEach((error) => {
          errorMessages[error.path[0]] = error.message;
        });

        console.log(errorMessages);
        setErros(errorMessages);

        return; //  Stop execution if validation fails
      }
    }

  
    try {
      const response = await axios.post(
        `${connectionUrl}/api/v1/adduser`,
        { email, username, description, entityType,  phoneNumber: phone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response);
      if (response.status === 201) {
        alert("User added successfully");
      } else {
        alert("User already exists");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetHandler = () => {
    if (emailRef.current) emailRef.current.value = "";
    if (usernameRef.current) usernameRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (phoneRef.current) phoneRef.current.value = "";
  };
{

  return (
    <div className=" flex flex-col justify-between">
      <Header />

      {localStorage.getItem("token") ? (
        <div className="py-8 md:py-12 flex items-center justify-center bg-gray-100 min-h-screen px-4">
          <div className="w-full max-w-[95%] md:max-w-[600px] bg-white flex flex-col rounded-lg shadow-lg p-4 md:p-8">
            <div className="flex items-center flex-col justify-between mb-4 md:mb-6">
              <div className="flex items-center justify-between py-2 md:py-4 w-full">
                <h1 className="text-xl md:text-2xl font-bold">{t("Add User")}</h1>
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
                    <div className="w-full max-w-sm">
                      <label
                        htmlFor="phone-input"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {t("Phone number:")}
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
                          ref={phoneRef}
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
                        {t("Please select the information for the user.")}
                      </p>
                    </div>

                    { error.phone && <p className="text-red-500 text-sm">{error.phone}</p> }
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      ref={emailRef}
                      placeholder={t("New Email Address (required)")}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3">
                      <CiMail />
                    </span>
                    {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      ref={usernameRef}
                      placeholder={t("New Username (required)")}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3">
                      <CiMail />
                    </span>
                    {error.userName && <p className="text-red-500 text-sm">{error.userName}</p>}
                  </div>

                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                      <p className="text-lg sm:text-xl">{t("Entity Type")}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-16 sm:ml-4">
                      <div className="flex items-center gap-0.5">
                        <input
                          type="radio"
                          name="entityType"
                          defaultChecked
                          onChange={() => {
                           
                            setEntityType("Normal");
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
                          {t("Workplace")}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      ref={descriptionRef}
                      placeholder={t("Description")}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 h-24 md:h-32 resize-none"
                    />
                  </div>
                  {error.description && <p className="text-red-500 text-sm">{error.description}</p>}
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
                    {t("Add Connection")}
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
  );
}
}
