
import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-gradient" style={{background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'}}>
      
      <div className="text-center text-white px-4">
        <h1 className="display-4 fw-bold mb-3" style={{textShadow: "2px 2px 8px rgba(0,0,0,0.4)"}}>
          Welcome to <span className="text-warning">Lost & Found Community</span>
        </h1>
       <p
  className="lead mb-5 text-warning text-center"
  style={{
    textShadow: "1px 1px 6px rgba(0,0,0,0.5)",
    fontSize: "1rem",          
    lineHeight: "1.5rem",      
    maxWidth: "90%",          
    margin: "0 auto",           
  }}
>
  Find lost items, report found items, and connect with your community quickly and safely.
</p>
      </div>
    
      <div className="d-flex flex-column flex-sm-row gap-3">
        <button
          className="btn btn-warning btn-lg shadow-lg px-4 py-2 fw-bold"
          onClick={() => navigate("/signup")}
          style={{transition: "transform 0.3s"}}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          User Login / Signup
        </button>
       
        <button
          className="btn btn-light btn-lg shadow-lg px-4 py-2 fw-bold text-primary"
          onClick={() => navigate("/admin/signup")}
          style={{transition: "transform 0.3s"}}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          Admin Login / Signup
        </button>
      </div>

      <div className="mt-5 text-white-50 fst-italic text-center">
        <p>Safe. Secure. Community-driven.</p>
      </div>
    </div>
  );
}

export default Landing;
