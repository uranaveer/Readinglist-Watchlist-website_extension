import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import React, { useState } from 'react';
import axios from 'axios';

const Linkstyle = {
  textDecoration: "none",
  color: "blue"
};

function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setErrorMsg(""); // Clear error when user edits input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://2ac2-103-37-201-222.ngrok-free.app/api/login/',
        credentials
      );

      const { access, refresh, username, is_emailverified } = response.data;

      setToken(access, refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("is_emailverified", is_emailverified);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg("Invalid login details. Please try again or sign up.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Login</h2>

        {errorMsg && (
          <div className="text-red-600 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username / Email</label>
        <input
          type="text"
          name="username"
          placeholder="username / abc@xyz.com"
          className="w-full px-4 py-2 border rounded"
          value={credentials.username}
          onChange={handleChange}
        />

        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={credentials.password}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          id="login_button"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-center text-sm">
          Don't have an account? <Link to="/sign_up" style={Linkstyle}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
