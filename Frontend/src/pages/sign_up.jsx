import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



function Sign_up() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const Linkstyle = {
    textDecoration: "none",
    color: "blue"
  };

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };
  const [saving, setSaving] = useState(false);

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
  setSaving(true);

  try {
    await axios.post("/api/sign-up/", {
      username,
      email,
      password,
    });
    navigate("/login");
  } catch (err) {
    console.log(err);
    setError("Signup failed. Try again later.");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="abc@xyz.com"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-type Password"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <button
            onClick={handleSignUp}
            disabled={saving}
            className={`w-full bg-black text-white py-2 font-semibold rounded 
                        border border-black transition active:scale-95
                        ${saving ? "opacity-70 cursor-not-allowed" : "hover:bg-white hover:text-black"}`}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>


          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" style={Linkstyle} className="underline hover:text-gray-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sign_up;
