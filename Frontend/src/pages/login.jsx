import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import React, { useState } from 'react';
import axios from 'axios';

const Linkstyle ={
  textDecoration: "none",
  color:"blue"
}

function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', credentials);
      const { token, refreshToken } = response.data;

      // Store the tokens in localStorage or secure cookie for later use
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      // Redirect or perform other actions upon successful login
    } catch (error) {
      // Handle login error
    }
  };

  const handleLogin = () => {
    setToken("this is a test token");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80 space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Username / Email</label>
        <input
          type="text"
          placeholder="username / abc@xyz.com"
          className="w-full px-4 py-2 border rounded"
          value={credentials.email}
          onChange={handleChange}
        />
        <label htmlFor="username" className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={credentials.password}
          onChange={handleChange}
        />
        <button onClick = {handleSubmit}
          id="login_button"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p>Don't have an account? <Link to="/sign_up" style={Linkstyle}>Sign up</Link></p>
        
      </div>
    </div>
  );
}


export default Login;

