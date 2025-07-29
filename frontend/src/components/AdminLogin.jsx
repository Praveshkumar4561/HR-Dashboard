import React, { useState } from "react";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import DashboardImage from "../assets/Dashboard.png";
import axios from "axios";

function AdminLogin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);

  let [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  let { email, password } = login;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/adminlogin`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/admin/dashboard");

        setTimeout(() => {
          localStorage.removeItem("isAuthenticated");
          navigate("/admin/login");
        }, 2 * 60 * 60 * 1000);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  let onInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    setError("");
  };

  return (
    <>
      <div className="container">
        <header className="logo">
          <div className="logo-box"></div>
          <span>LOGO</span>
        </header>

        <div className="card">
          <div className="left-panel">
            <img
              src={DashboardImage}
              alt="dashboard preview"
              className="dashboard-image"
            />
            <div className="left-pane">
              <h3>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod
              </h3>
              <p>
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="right-panel1">
              <h2>Welcome to Dashboard</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Email Address<span className="star-color">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={onInputChange}
                />

                <label>
                  Password<span className="star-color">*</span>
                </label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={onInputChange}
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="eye-color"
                    />
                  </span>
                </div>
                {error && (
                  <p style={{ color: "red", marginTop: "8px" }}>{error}</p>
                )}

                <button type="submit">Login</button>
                <p className="login-link">
                  Don’t have an account?{" "}
                  <Link to="/admin/register">Register</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
