import { LiaUserFriendsSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center  p-6 border-b border-neutral-200">
      <h1 className="text-4xl font-title text-neutral-950">
        Connection Visualizer
      </h1>
      <nav className="flex gap-6 items-center">
        <a
          onClick={() => navigate("/visualize")}
          className="text-neutral-700 flex items-center hover:text-primary-500 gap-1"
        >
          Visualize
          <LiaUserFriendsSolid className=" text-3xl" />
        </a>
        <a onClick={() => navigate("/addconnection")} className="text-neutral-700 hover:text-primary-500">
          Add Connection
        </a>

        <button onClick={() => navigate("/signup")} className="btn btn-primary cursor-pointer rounded-4xl p-3 bg-gray-200">
          Sign Up
        </button>
        <button onClick={() => navigate("/signin")} className="btn btn-secondary cursor-pointer rounded-4xl p-3 bg-gray-200">
          Sign In
        </button>
      </nav>
    </header>
  );
}
