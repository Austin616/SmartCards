import React from "react";
import FlashcardList from "./FlashcardList";

const FlashcardPage = ({ user, onLogout }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <FlashcardList user={user} /> {/* Pass user prop here */}
    </div>
  );
};

export default FlashcardPage;
