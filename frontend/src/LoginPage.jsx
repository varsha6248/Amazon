import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleForm = () => {
    setIsRegister((prev) => !prev);
    setMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setLoading(true);

  const url = isRegister
    ? "http://localhost:5000/register"
    : "http://localhost:5000/login";

  const payload = isRegister
    ? {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    : {
        email: formData.email,
        password: formData.password,
      };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(
        data.message || (isRegister ? "Registered successfully" : "Login successful")
      );

      if (!isRegister) {
        localStorage.setItem("token", data.token || "loggedin");
        localStorage.setItem(
          "user",
          JSON.stringify(data.user || { email: formData.email })
        );
        navigate("/home");
      } else {
        setIsRegister(false);
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } else {
      setMessage(data.message || "Something went wrong");
    }
  } catch (error) {
    setMessage("Server error. Check backend or CORS.");
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dbeafe, #fef3c7)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1f2937",
          }}
        >
          {isRegister ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={isRegister}
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: message.toLowerCase().includes("success") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#374151",
          }}
        >
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={toggleForm}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;