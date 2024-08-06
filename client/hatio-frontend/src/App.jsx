import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Todos from "./Components/Todos";
import Todo from "./pages/Todo";
import PrivateRoute from "./PrivateRoute";

function App() {
  const token = localStorage.getItem("refresh");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PrivateRoute element={<Todo />} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
