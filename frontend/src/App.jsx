import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthHandler from "./components/AuthHandler";
import Dashboard from "./components/dashboard";
import Navbar from "./components/NavBar"; // Import Navbar
import CreatePage from "./components/sets/createPage"; 
import ReviewSets from "./components/review/ReviewSets";
import SetDetailsPage from "./components/sets/SetDetailsPage";
import ReviewPage from "./components/review/ReviewPage";
import AiCreatePage from "./components/ai/AiCreatePage";

const App = () => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <GoogleOAuthProvider clientId="151727235395-ci6pbkgf8tuhkgttuk9e6bo1mkn9u20b.apps.googleusercontent.com">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/signin" element={<AuthHandler setUser={setUser} />} />
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/create" element={<CreatePage user={user} />} />
          <Route path="/review" element={<ReviewSets/>} />
          <Route path="/sets/:setId" element={<SetDetailsPage />} />
          <Route path="/review/:setId" element={<ReviewPage />} />
          <Route path="/ai-sets" element={<AiCreatePage/>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
