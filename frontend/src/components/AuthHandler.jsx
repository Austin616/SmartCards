import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";

const AuthHandler = ({ setUser }) => {
  const [user, setLocalUser] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem('user', JSON.stringify(res.data));  // Store user in local storage
      setLocalUser(res.data);
      setUser(res.data);  // Update user state in App
      navigate("/");  // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    setLocalUser(null);
    setUser(null); // Clear user state in App
    navigate("/");  // Redirect to signin after logout
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {!user ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">Sign in to continue</h2>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
              theme="filled_blue"
              shape="rectangular"
              size="large"
            />
          </div>
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default AuthHandler;
