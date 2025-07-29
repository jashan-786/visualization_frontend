import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { onDownloadClickHandler } from "../Visual";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { changeLanguage } from "i18next";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedFormat, setSelectedFormat] = useState("dwn");
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-6 border-b border-neutral-200">
      <h1
        onClick={() => {
          navigate("/");
        }}
        className="text-2xl sm:text-4xl font-title text-neutral-950 hover:cursor-pointer mb-4 sm:mb-0"
      >
        {t("Connection Visualizer")}
      </h1>
      <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 items-center">
        <a
          onClick={() => navigate("/visualize")}
          className="text-sm sm:text-base text-neutral-700 flex items-center hover:text-primary-500 gap-1 hover:cursor-pointer"
        >
          {t("Visualize")}
          <FaEye className="text-1xl" />
        </a>
        <a
          onClick={() => navigate("/addconnection")}
          className="text-sm sm:text-base flex items-center gap-1 text-neutral-700 hover:text-primary-500 hover:cursor-pointer"
        >
          {t("Add Connection")}
          <FaUserPlus className="text-1xl" />
        </a>
        <a
          onClick={() => navigate("/updateuser")}
          className="text-sm sm:text-base flex items-center gap-1 text-neutral-700 hover:text-primary-500 hover:cursor-pointer"
        >
          {t("Update User")}
          <FaUserEdit className="text-1xl" />
        </a>
        <a
          onClick={() => navigate("/adduser")}
          className="text-sm sm:text-base flex items-center gap-1 text-neutral-700 hover:text-primary-500 hover:cursor-pointer"
        >
          {t("Add User")}
          <IoIosAdd className="text-1xl" />
        </a>

{ localStorage.getItem("token") && (
        <select
          id="dropdown"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="text-sm sm:text-base bg-gray-200 border border-gray-300 rounded-lg p-2"
        >
          <option value="dwn"> {t("-- Download --")}</option>
          <option value="pdf">{t("PDF")}</option>
          <option value="json">{t("JSON")}</option>
        </select>
      )}
        {selectedFormat != "dwn" && (
          <div>
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => onDownloadClickHandler(selectedFormat)}
            >
              <FaDownload className="inline" />
      
            </button>
          </div>
        )}

        <select
       
          className="text-sm sm:text-base bg-gray-200 border border-gray-300 rounded-lg p-2"
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="">{t("Select Language")}</option>
          <option value="en">{t("English")}</option>
          <option value="fr">{t("French")}</option>

        </select>
       

        {localStorage.getItem("token") ? (
          ""
        ) : (
          <button
            onClick={() => navigate("/signup")}
            className="text-sm sm:text-base btn btn-primary cursor-pointer rounded-4xl p-2 sm:p-3 bg-gray-200"
          >
            {t("Sign Up")}
          </button>
        )}
        {localStorage.getItem("token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="text-sm sm:text-base btn btn-secondary cursor-pointer rounded-4xl p-2 sm:p-3 bg-gray-200"
          >
            {t("Sign Out")}
          </button>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="text-sm sm:text-base btn btn-secondary cursor-pointer rounded-4xl p-2 sm:p-3 bg-gray-200"
          >
            {t("Sign In")}
          </button>
        )}
      </nav>
    </header>
  );
}
