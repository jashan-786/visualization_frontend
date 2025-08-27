import { IoIosClose } from "react-icons/io";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import axios from "axios";
import { connectionUrl } from "./utils/connectionUrl";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { searchUser } from "./utils/helper"; // helper function that fetches users by type

const formObject = z.object({
  email: z.string().email("Invalid email format").optional(),
  phone: z
    .string()
    .regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, "Invalid phone format")
    .optional(),
  entityType: z.string(),
  description: z.string().min(1, "Description is required").optional(),
  username: z.string().min(1, "Username is required").optional(),
});

export const Updateuser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState<"phonenumber" | "email" | "username">("phonenumber");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [showFields, setShowFields] = useState({
    phonenumber: false,
    email: false,
    username: false,
    description: false,
  });
  const [entityType, setEntityType] = useState("Normal");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic search
  const handleSearch = useCallback(
    (query: string, type: "phonenumber" | "email" | "username") => {
      if (!query) {
        setSearchResults([]);
        return;
      }
      searchUser(query, type, setSearchResults); // search helper fetches matching users
    },
    []
  );

  const handleUpdate = async () => {
    if (!selectedUser) return alert("Select a user to update");

    const payload = {
      phone: phoneRef.current?.value,
      email: emailRef.current?.value,
      username: usernameRef.current?.value,
      description: descriptionRef.current?.value,
      entityType,
    };

    const validation = formObject.safeParse(payload);
    if (!validation.success) {
      const errs: any = {};
      validation.error.errors.forEach((err) => {
        errs[err.path[0]] = err.message;
      });
      setErrors(errs);
      console.error("Validation errors:", errs);
      alert(" Please fix the following errors before submitting." + "\n" +(Object.keys(errs).map(key => ` ${errs[key]}`)));
      return;
    }

    try {
      const res = await axios.post(
        `${connectionUrl}/api/v1/updateUser`,
        { mainId: selectedUser._id, ...payload },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(res.data.message || "User updated successfully");
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
      setShowFields({ phonenumber: false, email: false, username: false, description: false });
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {localStorage.getItem("token") ? (
        <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center">
          <div className="w-full max-w-[580px] bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">{t("Update User")}</h1>
              <IoIosClose className="cursor-pointer text-2xl" onClick={() => navigate("/")} />
            </div>

            {/* Search section */}
            <div className="mb-4">
              <div className="flex gap-3 mb-2">
                {["phonenumber", "username", "email"].map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      checked={searchType === type}
                      onChange={() => setSearchType(type as any)}
                    />{" "}
                    {t(type.charAt(0).toUpperCase() + type.slice(1))}
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={searchQuery}
                placeholder="Search user"
                className="border p-2 rounded w-full"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value, searchType);
                }}
              />
              {searchResults.length > 0 && (
                <ul className="border max-h-48 text-black overflow-y-auto mt-2">
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 cursor-pointer hover:bg-gray-200 text-black"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery(
                          searchType === "username"
                            ? user.username
                            : searchType === "email"
                            ? user.email
                            : user.phoneNumber
                        );
                        setSearchResults([]);
                      }}
                    >
                      {searchType === "username"
                        ? user.username
                        : searchType === "email"
                        ? user.email
                        : user.phoneNumber}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedUser && (
              <div className="space-y-3">
                {/* Toggle fields */}
                <div className="flex gap-1 mb-2">
                  {["phonenumber", "email", "username", "description"].map((field) => (
                    <label key={field} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showFields[field as keyof typeof showFields]}
                        onChange={(e) =>
                          setShowFields((prev) => ({ ...prev, [field]: e.target.checked }))
                        }
                      />
                      {t(`Update ${field.charAt(0).toUpperCase() + field.slice(1)}`)}
                    </label>
                  ))}
                </div>

                {/* Input fields */}
                {showFields.phonenumber && (
                  <input
                    type="text"
                    ref={phoneRef}
                    defaultValue={selectedUser.phoneNumber}
                    placeholder="New phone"
                    className="border p-2 rounded w-full"
                  />
                )}
                {showFields.email && (
                  <input
                    type="email"
                    ref={emailRef}
                    defaultValue={selectedUser.email}
                    placeholder="New email"
                    className="border p-2 rounded w-full"
                  />
                )}
                {showFields.username && (
                  <input
                    type="text"
                    ref={usernameRef}
                    defaultValue={selectedUser.username}
                    placeholder="New username"
                    className="border p-2 rounded w-full"
                  />
                )}
                {showFields.description && (
                  <textarea
                    ref={descriptionRef}
                    defaultValue={selectedUser.description}
                    placeholder="New description"
                    className="border p-2 rounded w-full"
                  />
                )}

                {/* Entity type */}
                <div className="flex gap-4 mt-2">
                  {["Normal", "Workplace"].map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="entityType"
                        checked={entityType === type}
                        onChange={() => setEntityType(type)}
                      />
                      {t(type)}
                    </label>
                  ))}
                </div>

                {errors && (
                  <div className="text-red-500">
                    {Object.values(errors).map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    onClick={handleUpdate}
                  >
                    {t("Update User")}
                  </button>
                  <button
                    className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery("");
                      setShowFields({ phonenumber: false, email: false, username: false, description: false });
                    }}
                  >
                    {t("Reset")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Wrapper />
      )}
    </div>
  );
};

export default Updateuser;
