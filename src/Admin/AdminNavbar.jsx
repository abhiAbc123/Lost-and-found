
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAdminToken } from "../apiAdmin";

function AdminNavbar({ setIsAdminLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminToken"); 
    setAdminToken(null); 
    navigate("/admin/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/admin/dashboard">Admin Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/manage-users">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/manage-items">Items</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger ms-2" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
