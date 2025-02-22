import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homePage";
import AuthHandler from "./components/AuthHandler";
import Dashboard from "./components/dashboard";
import Navbar from "./components/NavBar"; // Import Navbar
import CreatePage from "./components/createPage"; 
import SetDetailsPage from './components/SetDetailsPage';

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
          <Route path="/" element={<HomePage user={user}/>} />
          <Route path="/signin" element={<AuthHandler setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/create" element={<CreatePage user={user} />} />
          <Route path="/review" element={<div>Review Sets</div>} />
          <Route path="/sets/:setId" element={<SetDetailsPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
