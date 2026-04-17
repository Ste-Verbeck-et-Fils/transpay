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
import Verify from "./src/pages/verify";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(userStr);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "controleur") {
      return <Navigate to="/verify" state={{ unauthorized: true }} replace />;
    }
    return <Navigate to="/home" state={{ unauthorized: true }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/historique" element={<ProtectedRoute allowedRoles={["passager"]}><Historique /></ProtectedRoute>} />
          <Route path="/trajet" element={<ProtectedRoute allowedRoles={["passager"]}><Trajet /></ProtectedRoute>} />
          <Route path="/paiement" element={<ProtectedRoute allowedRoles={["passager"]}><Paiement /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute allowedRoles={["passager"]}><Scan /></ProtectedRoute>} />
          <Route path="/ticket" element={<ProtectedRoute allowedRoles={["passager"]}><Ticket /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute allowedRoles={["controleur"]}><Verify /></ProtectedRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
