import { FaUserEdit, FaUserMinus, FaUserPlus } from "react-icons/fa";
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

  const handleOpsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Selected value:", value);

    if (value === "addUser") {
      console.log("Add User clicked");
      navigate("/adduser");
    } else if (value === "updateUser") {
      navigate("/updateuser");
    } else if (value === "deleteUser") {
      navigate("/deleteuser");
    } else if (value === "addconnection") {
      navigate("/addconnection");
    } else if (value === "updateconnection") {
      navigate("/updateconnection");
    } else if (value === "deleteconnection") {
      navigate("/deleteconnection");
    }
  };
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
      <nav className="flex cursor-pointer flex-wrap justify-center gap-3 sm:gap-6 items-center">
        <a onClick={() => navigate("/visualize")} className="flex items-center gap-2 text-sm sm:text-base">
          {t("Visualize")}
          <FaEye className="text-1xl" />
        </a>

        <select onChange={handleOpsChange}>
          <option value="" disabled selected hidden>
            {t(" User Ops")}
          </option>
          <option value="addUser">
            {t("Add User")}
            <IoIosAdd className="text-1xl" />
          </option>
          <option value={"updateUser"}>
            {t("Update User")}
            <FaUserEdit className="text-1xl" />
          </option>
          <option value="deleteUser">
            {t("Delete User")}
            <FaUserMinus className="text-1xl" />
          </option>
        </select>

        <select onChange={handleOpsChange}>
          <option value="" disabled selected hidden>
            {t(" Connection Ops")}
          </option>
          <option value="addconnection">
            {t("Add Connection")}
            <FaUserPlus className="text-1xl" />
          </option>
          <option value="updateconnection">
            {t("Update Connection")}
            <FaUserEdit className="text-1xl" />
          </option>
          <option value="deleteconnection">
            {t("Delete Connection")}
            <FaUserMinus className="text-1xl" />
          </option>
        </select>

        {localStorage.getItem("token") && (
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
