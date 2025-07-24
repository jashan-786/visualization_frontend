import "./App.css";
import { Landing } from "./Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Visual from "./Visual";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { AddConnection } from "./AddConnection";
import UpdateConnection from "./UpdateConnection";
import AddUser from "./AddUser";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function App() {
  return (
    <I18nextProvider i18n={i18n}>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />  
        <Route path="/visualize" element={<Visual />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addconnection" element={<AddConnection />} />
        <Route path="/updateuser" element={<UpdateConnection />} />
        <Route path="/adduser" element={<AddUser />} />
      </Routes>
    </BrowserRouter>

    </I18nextProvider>
  );
}

export default App;
