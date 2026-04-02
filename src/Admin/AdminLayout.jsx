
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ setIsAdminLoggedIn }) {
  return (
    <>
      <AdminNavbar setIsAdminLoggedIn={setIsAdminLoggedIn} />
      <div className="container my-4">
        <Outlet />
      </div>
    </>
  );
}
