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
import ApiTestComponent from "./components/ai/ApiTestComponent";

const App = () => {
  const [user, setUser] = useState(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_AUTH;

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
      <GoogleOAuthProvider clientId={googleClientId}>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/signin" element={<AuthHandler setUser={setUser} />} />
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/create" element={<CreatePage user={user} />} />
          <Route path="/review" element={<ReviewSets/>} />
          <Route path="/sets/:setId" element={<SetDetailsPage />} />
          <Route path="/review/:setId" element={<ReviewPage />} />
          <Route path="/ai-sets" element={<AiCreatePage/>} />
          <Route path="/test" element={<ApiTestComponent/>}/>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
