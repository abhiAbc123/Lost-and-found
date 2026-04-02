
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import APIAdmin, { setAdminToken } from "../apiAdmin"; 

function AdminLogin({ setIsAdminLoggedIn }) {
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !adminCode) return alert("Enter all fields");

    try {
      const { data } = await APIAdmin.post("/login", { email, password, adminCode });

      
      localStorage.setItem("adminToken", data.token);
      setAdminToken(data.token);

      setIsAdminLoggedIn(true);
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials or admin code");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: "linear-gradient(135deg, #FF512F, #DD2476)" }}
    >
      <div className="card p-5 shadow-lg rounded-4" style={{ minWidth: "400px" }}>
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#DD2476", textShadow: "1px 1px 5px rgba(0,0,0,0.3)" }}
        >
          Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Admin Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-danger w-100 fw-bold" style={{ transition: "0.3s" }}>
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default AdminLogin;




