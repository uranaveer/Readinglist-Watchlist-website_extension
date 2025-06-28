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

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSignUp = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    const usernameRegex = /^[a-zA-Z][a-zA-Z._]*$/;
    if (!usernameRegex.test(username)) {
      setError("Username must start with a letter and can contain only letters, dots (.), and underscores (_).");
    return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
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

      // if sign-up successful, now prompt for OTP
      setShowOtpField(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setError("Please enter the verification code.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await axios.post("https://api.uranaveer.xyz/api/verify-otp/", {
        email: formData.email,
        otp: trimmedOtp,
      });

      // OTP verified successfully, redirect to login
      alert("Email verified, You can login into your account")
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const Linkstyle = {
    textDecoration: "none",
    color: "blue",
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        {!showOtpField ? (
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
        ) : (
          <div className="space-y-5">
            <p className="text-center text-sm text-gray-700">
              We’ve sent a 6-digit code to your email.
            </p>

            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              inputMode="text"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              placeholder="Enter verification code"
              className="w-full px-4 py-2 border border-gray-300 rounded text-center tracking-widest"
            />

            <button
              onClick={handleVerifyOtp}
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
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sign_up;