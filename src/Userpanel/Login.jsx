

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, setAuthToken } from "../api";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password }); 
      localStorage.setItem("token", data.token); 
      setAuthToken(data.token);
      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" 
         style={{ background: 'linear-gradient(135deg, #FF512F, #DD2476)' }}>
      <div className="card p-5 shadow-lg rounded-4" style={{ minWidth: "400px" }}>
        <h2 className="text-center mb-4 fw-bold" 
            style={{ color: "#DD2476", textShadow: "1px 1px 5px rgba(0,0,0,0.3)" }}>
          User Login
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
          <div className="mb-4">
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
          <button
            type="submit"
            className="btn w-100 fw-bold text-white"
            style={{
              background: "linear-gradient(45deg, #FF512F, #DD2476)",
              border: "none",
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              transition: "0.3s",
              borderRadius: "10px",
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-muted">
          Don’t have an account? <Link to="/signup" className="text-decoration-none fw-bold text-danger">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
