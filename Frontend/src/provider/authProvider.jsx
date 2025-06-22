import axios from "axios";
import authAxios from "../provider/authAxios"; // import your secured axios instance
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  axios.defaults.baseURL = 'https://uranaveer.xyz';
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Update both token and refreshToken in state/storage
  const setToken = (newToken, refreshToken = null) => {
    setToken_(newToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("token", newToken);
  };

  // Keep headers in sync whenever token changes
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      //axios.defaults.headers.common["Authorization"] = "Bearer " + token;     // for public (optional)
      authAxios.defaults.headers.common["Authorization"] = "Bearer " + token; // for protected
    } else {
      //delete axios.defaults.headers.common["Authorization"];
      delete authAxios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const contextValue = useMemo(() => ({ token, setToken }), [token]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
