

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" 
         style={{ background: "linear-gradient(90deg, #06beb6, #48b1bf)", fontWeight: "500" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-white" to="/">
          Lost & Found
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white mx-2" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white mx-2" to="/post-lost">Post Lost</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white mx-2" to="/post-found">Post Found</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white mx-2" to="/myposts">My Posts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white mx-2" to="/profile">Profile</Link>
            </li>
          </ul>
          
          <button
            className="btn btn-outline-light fw-bold shadow-sm"
            style={{
              transition: "0.3s",
              borderRadius: "8px",
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


