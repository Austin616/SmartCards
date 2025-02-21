import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthHandler from "./components/AuthHandler";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="151727235395-ci6pbkgf8tuhkgttuk9e6bo1mkn9u20b.apps.googleusercontent.com">
      <AuthHandler />
    </GoogleOAuthProvider>
  );
};

export default App;
