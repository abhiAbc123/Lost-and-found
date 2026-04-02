
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import Signup from "./Userpanel/Signup";
import Login from "./Userpanel/Login";
import Home from "./Userpanel/Home";
import PostLost from "./Userpanel/PostLost";
import PostFound from "./Userpanel/PostFound";
import MyPosts from "./Userpanel/MyPosts";
import ItemDetails from "./Userpanel/ItemDetails";
import Profile from "./Userpanel/Profile";
import UserLayout from './Userpanel/UserLayout';

import Navbar from "./Userpanel/Navbar";
import Footer from "./Userpanel/Footer";
import Landing from './Landing';
import AdminSignup from './Admin/AdminSignup';
import AdminLogin from './Admin/AdminLogin';
import AdminNavbar from './Admin/AdminNavbar';
import Dashboard from './Admin/Dashboard';
import ManageItems from './Admin/ManageItems';
import ManageUsers from './Admin/ManageUsers';
import AdminLayout from './Admin/AdminLayout';
import "leaflet/dist/leaflet.css";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem("isAdminLoggedIn") === "true");

  
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  return (
    <Router>
      <Routes>
       
        <Route
          path="/"
          element={
            isAdminLoggedIn ? (
              <Navigate to="/admin/dashboard" />
            ) : isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Landing />
            )
          }
        />

        {!isAdminLoggedIn && (
          <>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />

            <Route
              element={
                isLoggedIn ? (
                  <UserLayout setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <Navigate to="/" />
                )
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/post-lost" element={<PostLost />} />
              <Route path="/post-found" element={<PostFound />} />
              <Route path="/myposts" element={<MyPosts />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </>
        )}

       
        {!isLoggedIn && (
          <>
            <Route path="/admin/login" element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
            <Route path="/admin/signup" element={<AdminSignup setIsAdminLoggedIn={setIsAdminLoggedIn} />} />

            <Route
              element={
                isAdminLoggedIn ? (
                  <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn} />
                ) : (
                  <Navigate to="/" />
                )
              }
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/admin/manage-items" element={<ManageItems />} />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;