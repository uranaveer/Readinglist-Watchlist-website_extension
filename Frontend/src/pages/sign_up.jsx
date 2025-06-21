import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sign_up() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    // TODO: Replace with real API call
    try {
      console.log("Signing up with:", formData);
      await axios.post("https://2ac2-103-37-201-222.ngrok-free.app/api/sign_up/", { username, email, password });
      navigate("/login"); // Redirect to login after successful signup
    } catch (err) {
      console.log(err);
      setError("Signup failed. Try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
          <input
            name="username"
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 mt-1 border rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@xyz.com"
            className="w-full px-4 py-2 mt-1 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 mt-1 border rounded"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-type Password"
            className="w-full px-4 py-2 mt-1 border rounded"
          />
        </div>

        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Sign_up;
