import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import APIAdmin, { setAdminToken } from "../apiAdmin";

function AdminSignup({ setIsAdminLoggedIn }) {
  const [name, setName] = useState("");      
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState(""); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !adminCode) return alert("Enter all fields");

    try {
      const { data } = await APIAdmin.post("/signup", { name, email, password, adminCode });
      localStorage.setItem("adminToken", data.token);
      setAdminToken(data.token);
      setIsAdminLoggedIn(true);
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #FF512F, #DD2476)' }}>
      <div className="card p-5 shadow-lg rounded-4" style={{ minWidth: "400px" }}>
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#DD2476", textShadow: "1px 1px 5px rgba(0,0,0,0.3)" }}>Admin Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input type="text" className="form-control" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Admin Code</label>
            <input type="text" className="form-control" placeholder="Enter admin code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-danger w-100 fw-bold">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-muted">
          Already have an account? <Link to="/admin/login" className="text-decoration-none fw-bold text-danger">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminSignup;
