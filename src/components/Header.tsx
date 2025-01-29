import React from "react";
import { FaHandshake } from "react-icons/fa";
import { LiaUserFriendsSolid } from "react-icons/lia";

export default function Header() {
  return (
    <header className="flex justify-between items-center  p-6 border-b border-neutral-200">
      <h1 className="text-4xl font-title text-neutral-950">
        Connection Visualizer
      </h1>
      <nav className="flex gap-6 items-center">
        <a
          href="#features"
          className="text-neutral-700 flex items-center hover:text-primary-500 gap-1"
        >
          Visualize
          <LiaUserFriendsSolid className=" text-3xl" />
        </a>
        <a href="#about" className="text-neutral-700 hover:text-primary-500">
          Add Connection
        </a>

        <button className="btn btn-primary  cursor-pointer rounded-4xl p-3 bg-gray-200">
          Sign Up
        </button>
        <button className="btn btn-secondary cursor-pointer  rounded-4xl p-3 bg-gray-200">
          Sign In
        </button>
      </nav>
    </header>
  );
}
