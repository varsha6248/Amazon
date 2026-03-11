import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setMessage("");
    setFormData({
      name: "",
      email: "",
      password: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          setMessage("Registration successful. Please login.");
          setIsRegister(false);
          setFormData({
            name: "",
            email: "",
            password: ""
          });
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/home");
        }
      } else {
        setMessage(data.message || "Request failed");
      }
    } catch (error) {
      setMessage("Backend not connected");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left-shape"></div>

      <div className="login-card">
        <h2>{isRegister ? "Sign Up" : "Login In"}</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
            <input
    type="text"
    name="fakeuser"
    autoComplete="username"
    style={{ display: "none" }}
  />

  <input
    type="password"
    name="fakepass"
    style={{ display: "none" }}
  />
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="login-input"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />

          <div className="password-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="login-input password-input"
            />
            <span className="eye-icon">👁</span>
          </div>

          {!isRegister && <p className="forgot-text">Forgot password</p>}

          <button type="submit" className="login-btn">
            {isRegister ? "Sign Up" : "Log in"}
          </button>
        </form>

        <p className="switch-text">
          {isRegister ? "Already have an account?" : "New user?"}{" "}
          <span onClick={toggleForm}>
            {isRegister ? "Login" : "Sign up"}
          </span>
        </p>

        {message && <p className="message-text">{message}</p>}

        <div className="social-icons">
          <span>G</span>
        </div>
      </div>

      <div className="illustration-side">
  <img
    src="/login-illustration.png"
    alt="Shopping Illustration"
    className="illustration-image"
  />
</div>
    </div>
  );
};

export default LoginPage;