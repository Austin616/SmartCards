import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import FlashcardPage from "./FlashcardPage";

const AuthHandler = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        token: credentialResponse.credential,
      });
      setUser(res.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-xl font-bold mb-4">Sign in to continue</h2>
          <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
        </div>
      ) : (
        <FlashcardPage user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default AuthHandler;
