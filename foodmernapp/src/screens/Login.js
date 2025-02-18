import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/loginuser`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      console.log(json);

      if (!json.success) {
        setMessage("Invalid credentials, please try again!");
      } else {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authToken);
        console.log("AuthToken stored in localStorage:", json.authToken);
        
        setMessage("Login successful! Redirecting...");
        
        // Simple admin check based on email
        setTimeout(() => {
          if (credentials.email === "admin@admin.com") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/sideways-asian-dish-with-copy-space_23-2148242494.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        
        {message && (
          <div
            className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}
            role="alert"
          >
            {message}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label text-black">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label text-black">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        <Link to="/createuser" className="btn btn-link w-100 mt-3">
          I am a new user?
        </Link>
      </form>
    </div>
  );
}