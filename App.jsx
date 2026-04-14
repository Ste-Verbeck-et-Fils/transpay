import React from "react";
import Home from "./src/pages/home";
import Login from "./src/pages/login";
import Register from "./src/pages/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./src/components/layout/Header";

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
