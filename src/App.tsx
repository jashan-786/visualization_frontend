import { useState } from "react";
import "./App.css";
import { Landing } from "./Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Visual from "./Visual";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { AddConnection } from "./AddConnection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/visualize" element={<Visual />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addconnection" element={<AddConnection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
