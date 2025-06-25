import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import React, { useState } from 'react';
import axios from 'axios';



function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const Linkstyle = {
    textDecoration: "none",
    color: "blue"
  };

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
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/api/login/',
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
    <div className="bg-white min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6">Login to your Account</h2>

        {errorMsg && (
          <div className="text-red-600 text-sm text-center mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username / Email</label>
            <input
              type="text"
              name="username"
              placeholder="username / abc@xyz.com"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            id="login_button"
            className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-white hover:text-black border border-black transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{' '}
          <Link to="/sign_up" style={Linkstyle} className="underline hover:text-gray-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
