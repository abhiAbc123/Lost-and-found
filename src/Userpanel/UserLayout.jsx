import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserLayout({ setIsLoggedIn }) {
  return (
    <>
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <div className="container my-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
