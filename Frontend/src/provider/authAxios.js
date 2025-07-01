// src/utils/authAxios.js
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Create an Axios instance for authenticated requests
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // change this to your backend's base URL
  //baseURL: "https://api.uranaveer.xyz/",
});

// Interceptor for handling token refresh
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&                // If the response status is 401 (Unauthorized)
      !originalRequest._retry &&                       // Ensure this is the first retry attempt
      localStorage.getItem("refreshToken")             // And we have a refresh token
    ) {
      originalRequest._retry = true;                   // Mark this request as retried

      try {
        // Try to refresh the access token
        const res = await axios.post("/api/token/refresh/", {
          refresh: localStorage.getItem("refreshToken"),
        });
        console.log(res);

        const newAccessToken = res.data.access;
        localStorage.setItem("token", newAccessToken);  // Save new access token

        // Update auth headers
        authAxios.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        return authAxios(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);

        // Token refresh failed, remove tokens and reject
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Redirect to login
        window.location.href = "/login";  // << Redirect to login page

        return Promise.reject(refreshError); // Reject the request
      }
    }

    return Promise.reject(error); // Any other error
  }
);


export default authAxios;
