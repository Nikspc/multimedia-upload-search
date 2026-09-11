import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { me, logout } from "./features/auth/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import FileDetails from "./pages/FileDetails";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => { dispatch(me()); }, [dispatch]);

  console.log({ Login, Register, Dashboard, Upload, FileDetails, ProtectedRoute });


  return (
    <div className="container">
      <header className="topbar">
        <Link to="/">Dashboard</Link>
        {user ? (
          <>
            <Link to="/upload">Upload</Link>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        }/>

        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        }/>

        <Route path="/files/:id" element={
          <ProtectedRoute><FileDetails /></ProtectedRoute>
        }/>
      </Routes>
    </div>
  );
}