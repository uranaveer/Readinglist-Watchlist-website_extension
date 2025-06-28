import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const Linkstyle = {
    textDecoration: "none",
    color: "blue",
  };

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const response = await axios.post("/api/login/", credentials);
      const { access, refresh, username, is_emailverified } = response.data;

      if (!is_emailverified) {
        await axios.post("https://api.uranaveer.xyz/api/send-otp/", {
          username: credentials.username,
        });
        setShowOTPInput(true);
        return;
      }

      setToken(access, refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("is_emailverified", is_emailverified);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg("Invalid login details. Please try again or sign up.");
    } finally {
      setSaving(false);
    }
  };

  const handleOTPVerify = async () => {
    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP sent to your email.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      await axios.post("https://api.uranaveer.xyz/api/verify-otp/", {
        username: credentials.username,
        otp: otp.trim(),
      });

      alert("OTP verified!");
      setShowOTPInput(false);
      setOtp("");
    } catch (err) {
      console.error(err);
      setErrorMsg("OTP verification failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6">Login to your Account</h2>

        {errorMsg && (
          <div className="text-red-600 text-sm text-center mb-4">{errorMsg}</div>
        )}

        {showOTPInput ? (
          <div className="space-y-4 mt-6">
            <label className="block text-sm font-medium mb-1">
              Enter the verification code sent to your email
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Your email is not verified. Please enter the OTP sent to your registered email address to proceed.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              className={`w-full bg-black text-white py-2 rounded font-semibold 
                          border border-black transition active:scale-95
                          ${saving ? "opacity-70 cursor-not-allowed" : "hover:bg-white hover:text-black"}`}
              onClick={handleOTPVerify}
              disabled={saving}
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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username / Email
              </label>
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
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
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
              disabled={saving}
              className={`w-full bg-black text-white py-2 rounded font-semibold 
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/sign_up" style={Linkstyle} className="underline hover:text-gray-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
