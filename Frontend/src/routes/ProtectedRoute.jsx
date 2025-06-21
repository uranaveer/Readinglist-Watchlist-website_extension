import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import authAxios from "../provider/authAxios";

export const ProtectedRoute = () => {
  const { token, setToken } = useAuth();
  const [loading, setLoading] = useState(true); // wait until token refresh check is done
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        // Already have valid token
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Try to refresh the token using refreshToken
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("/auth/refresh", { refreshToken });
          const newAccessToken = res.data.accessToken;
          setToken(newAccessToken);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Refresh failed", err);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [token, setToken]);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
