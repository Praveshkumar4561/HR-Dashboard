import React, { useState } from "react";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import DashboardImage from "../assets/Dashboard.png";
import axios from 'axios'


function AdminRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  let { fullname, email, password, confirmPassword } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Confirm password does not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2100/api/adminregister",
        {
          fullname,
          email,
          password,
        }
      );

      if (response.data.success) {
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setError("Registration failed");
    }
  };

  let onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
            <div className="left-panel1">
              <img
                src={DashboardImage}
                alt="dashboard preview"
                className="dashboard-image"
              />
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
                  Full name<span className="star-color">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  name="fullname"
                  value={fullname}
                  onChange={onInputChange}
                />

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

                <label>
                  Confirm Password<span className="star-color">*</span>
                </label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onInputChange}
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon
                      className="eye-color"
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </span>
                </div>
                {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

                <button type="submit">Register</button>

                <p className="login-link">
                  Already have an account? <Link to="/admin/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminRegister;
