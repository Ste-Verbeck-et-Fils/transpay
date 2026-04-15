import React from "react";
import Home from "./src/pages/home";
import Login from "./src/pages/login";
import Register from "./src/pages/register";
import Profile from "./src/pages/profile";
import Historique from "./src/pages/historique";
import Trajet from "./src/pages/trajet";
import Paiement from "./src/pages/paiement";
import Scan from "./src/pages/scan";
import Ticket from "./src/pages/ticket";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/trajet" element={<Trajet />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/ticket" element={<Ticket />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
