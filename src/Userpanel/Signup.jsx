
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { signupUser, setAuthToken, facebookLogin } from "../api";

function Signup({ setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fbLoaded, setFbLoaded] = useState(false); 
  const navigate = useNavigate();

  
  useEffect(() => {
    if (window.FB) {
      setFbLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.fbAsyncInit = function () {
        FB.init({
          appId: "31613913798255590", 
          cookie: true,
          xfbml: true,
          version: "v17.0",
        });
        setFbLoaded(true);
      };
    };

    return () => {
      const fbScript = document.getElementById("facebook-jssdk");
      if (fbScript) fbScript.remove();
    };
  }, []);

  
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const { data } = await signupUser({ name, email, password });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setIsLoggedIn(true);
      alert("Signup successful!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      console.error(err);
    }
  };

  
  const handleFacebookResponse = async (response) => {
    if (!response.accessToken) {
      alert("Facebook login failed");
      return;
    }

    try {
      const { data } = await facebookLogin({ accessToken: response.accessToken, provider: "facebook" });
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      setIsLoggedIn(true);
      alert("Facebook login successful!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Facebook login failed");
      console.error(err);
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
          User Signup
        </h2>

        
        <form onSubmit={handleSignup}>
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
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <button
            type="submit"
            className="btn btn-danger w-100 fw-bold"
            style={{ transition: "0.3s" }}
          >
            Sign Up
          </button>
        </form>

       
        {fbLoaded ? (
          <div className="mt-3 text-center">
            <FacebookLogin
              appId="31613913798255590" 
              autoLoad={false}
              fields="name,email,picture"
              callback={handleFacebookResponse}
              render={(renderProps) => (
                <button onClick={renderProps.onClick} className="btn btn-primary w-100 fw-bold mt-2">
                  Sign Up with Facebook
                </button>
              )}
            />
          </div>
        ) : (
          <p className="mt-3 text-center text-muted">Loading Facebook SDK...</p>
        )}

        <p className="mt-4 text-center text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-bold text-danger">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
