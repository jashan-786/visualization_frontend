import "./App.css";
import { Landing } from "./Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Visual from "./Visual";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { AddConnection } from "./AddConnection";
import  { Updateuser } from "./UpdateUser";
import { UpdateConnection } from "./modules/Connections/updateconnection";
import AddUser from "./AddUser";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { DeleteUser } from "./modules/User/deleteuser";
import { DeleteConnection } from "./modules/Connections/deleteconnection";

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
        <Route path="/updateuser" element={<Updateuser />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/deleteuser" element={<DeleteUser />} />
        <Route path="/deleteconnection" element={<DeleteConnection />} />
        <Route path="/updateconnection" element={<UpdateConnection />} />
      </Routes>
    </BrowserRouter>

    </I18nextProvider>
  );
}

export default App;
