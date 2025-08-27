import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Wrapper from "../../components/Wrapper";
import Header from "../../components/Header";
import { searchUser } from "../../utils/helper";
import { connectionUrl } from "../../utils/connectionUrl";

export const DeleteConnection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const searchfnc = useCallback(
    (
      query: string,
      type: "username" | "email" | "phonenumber",
      setState: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      searchUser(query, type, setState);
    },
    []
  );

  const [selectedOption, setSelectedOption] = useState<
    "phonenumber" | "email" | "username"
  >("phonenumber");

  const [fieldValue, setFieldValue] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);

  const onDeleteConnection = async () => {
    if (!currentUser || !selectedConnection) {
      alert("Please select a user and a connection to delete.");
      return;
    }
        console.log(currentUser._id);
        console.log(selectedConnection);
    try {
      const response = await axios.post(
        `${connectionUrl}/api/v1/deleteconnection`,
        {
          mainId: currentUser._id,
          connectionId: selectedConnection.connectionId._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.message || "Connection deleted successfully");

      // Reset state
      setFieldValue("");
      setSearchedUsers([]);
      setCurrentUser(null);
      setSelectedConnection(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete connection");
    }
  };

  const resetHandler = () => {
    setFieldValue("");
    setSearchedUsers([]);
    setCurrentUser(null);
    setSelectedConnection(null);
  };

  return (
    <div>
      <Header />
      {localStorage.getItem("token") ? (
        <div className="py-8 md:py-12 flex items-center justify-center bg-gray-100 min-h-screen px-4">
          <div className="w-full max-w-[95%] md:max-w-[600px] bg-white flex flex-col rounded-lg shadow-lg p-4 md:p-8">
            <div className="flex items-center justify-between py-2 md:py-4 w-full">
              <h1 className="text-xl md:text-2xl font-bold">
                {t("Delete Connection")}
              </h1>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="material-symbols-outlined cursor-pointer text-2xl transform hover:scale-110 transition-transform duration-300"
              >
                <IoIosClose />
              </button>
            </div>

            <div className="space-y-4">
              {/* Search User */}
              <div className="flex gap-3">
                <div>
                  <label>{t("Phone Number")}</label>
                  <input
                    type="radio"
                    checked={selectedOption === "phonenumber"}
                    onChange={() => setSelectedOption("phonenumber")}
                  />
                </div>
                <div>
                  <label>{t("Username")}</label>
                  <input
                    type="radio"
                    checked={selectedOption === "username"}
                    onChange={() => setSelectedOption("username")}
                  />
                </div>
                <div>
                  <label>{t("Email")}</label>
                  <input
                    type="radio"
                    checked={selectedOption === "email"}
                    onChange={() => setSelectedOption("email")}
                  />
                </div>
              </div>

              <input
                type="text"
                value={fieldValue}
                placeholder="Search user"
                className="border p-2 rounded w-full"
                onChange={(e) => {
                  setFieldValue(e.target.value);
                  searchfnc(
                    e.target.value,
                    selectedOption,
                    setSearchedUsers
                  );
                }}
              />

              {/* Show searched users */}
              {searchedUsers.length > 0 && (
                <ul className="border max-h-48 overflow-y-auto">
                  {searchedUsers.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setCurrentUser(user);
                        setSearchedUsers([]);
                        setFieldValue(
                          selectedOption === "username"
                            ? user.username
                            : selectedOption === "email"
                            ? user.email
                            : user.phoneNumber
                        );
                      }}
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

              {/* Show connections of selected user */}
              {currentUser && currentUser.connections.length > 0 && (
                <div>
                  <h3 className="font-medium">Connections</h3>
                  <ul className="border max-h-48 overflow-y-auto">
                    {currentUser.connections.map((conn: any) => (
                      <li
                        key={conn.connectionId}
                        className={`p-2 cursor-pointer hover:bg-gray-200 ${
                          selectedConnection?.connectionId === conn.connectionId
                            ? "bg-gray-300"
                            : ""
                        }`}
                        onClick={() => { 
                            console.log(conn);
                            setSelectedConnection(conn)}}
                      >
                        {conn.connection}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={onDeleteConnection}
                >
                  Delete Connection
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={resetHandler}
                >
                  Reset
                </button>
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
