// import { createContext, useState } from "react";
// import PropTypes from "prop-types";

// export const ContextApi = createContext();

// const ContextProvider = ({ children }) => {
//   //login information
//   const [isloggedin, setIsloggedin] = useState(false);

//   //login photo
//   const [role, setRole] = useState("");

//   const value = {
//     isloggedin,
//     setIsloggedin,
//     setRole,
//     role,
//   };

//   return <ContextApi.Provider value={value}>{children}</ContextApi.Provider>;
// };

// ContextProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };


// export default ContextProvider;
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Check for token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If a token exists, validate it and set the authentication state
      validateToken(token);
    } else {
      setLoading(false); // If no token, set loading to false
    }
  }, []);

  // Validate the token (e.g., decode it and fetch user data)
  const validateToken = async (token) => {
    try {
      // Fetch user data from the backend using the token
      const response = await axios.get("/api/auth/current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { userId, role } = response.data;

      // Update the authentication state
      setUser({ userId, role });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token validation failed:", error);
      logout(); // Clear the invalid token
    } finally {
      setLoading(false); // Set loading to false after validation
    }
  };

  // Login function (to be called after successful login in Login.jsx)
  const login = (userData) => {
    // Update the authentication state
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Clear the authentication state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);