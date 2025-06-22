// src/utils/authAxios.js
import axios from "axios";

// Create an Axios instance for authenticated requests
const authAxios = axios.create({
  baseURL: "http://uranaveer.xyz", // change this to your backend's base URL
});

// Interceptor for handling token refresh
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        // Refresh the access token
        const res = await axios.post("/auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Update headers
        authAxios.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        return authAxios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;
