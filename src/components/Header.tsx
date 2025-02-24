import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { FaEye } from "react-icons/fa";

export default function Header() {

  const navigate = useNavigate();
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-6 border-b border-neutral-200">
      <h1 onClick={() => { navigate("/") }} className="text-2xl sm:text-4xl font-title text-neutral-950 hover:cursor-pointer mb-4 sm:mb-0">
        Connection Visualizer
      </h1>
      <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 items-center">
        <a
          onClick={() => navigate("/visualize")}
          className="text-sm sm:text-base text-neutral-700 flex items-center hover:text-primary-500 gap-1 hover:cursor-pointer"
        >
          Visualize
          <FaEye className="text-1xl" />
        </a>
        <a onClick={() => navigate("/addconnection")} className="text-sm sm:text-base flex items-center gap-1 text-neutral-700 hover:text-primary-500 hover:cursor-pointer">
          Add Connection
          <FaUserPlus className="text-1xl" />
        </a>
        <a onClick={() => navigate("/updateuser")} className="text-sm sm:text-base flex items-center gap-1 text-neutral-700 hover:text-primary-500 hover:cursor-pointer">
          Update User
          <FaUserEdit className="text-1xl" />
        </a>
        <a onClick={() => navigate("/adduser")} className="text-sm sm:text-base flex items-center gap-1 text-neutral-700 hover:text-primary-500 hover:cursor-pointer">
          Add User
          <IoIosAdd className="text-1xl" />
        </a>

        {localStorage.getItem("token") ? "" :
          <button onClick={() => navigate("/signup")} className="text-sm sm:text-base btn btn-primary cursor-pointer rounded-4xl p-2 sm:p-3 bg-gray-200">
            Sign Up
          </button>
        }
        {localStorage.getItem("token") ?
          <button onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }} className="text-sm sm:text-base btn btn-secondary cursor-pointer rounded-4xl p-2 sm:p-3 bg-gray-200">
            Sign Out
          </button>
          :
          <button onClick={() => navigate("/signin")} className="text-sm sm:text-base btn btn-secondary cursor-pointer rounded-4xl p-2 sm:p-3 bg-gray-200">
            Sign In
          </button>
        }
      </nav>
    </header>
  );
}
