import React from "react";
import axios from "axios";

const DeleteFlashcardForm = ({ onDeleteFlashcard, user }) => {
  const handleDelete = () => {
    if (user) {
      axios
        .delete(`http://127.0.0.1:5000/api/flashcards?user_email=${user.email}`)
        .then(() => {
          onDeleteFlashcard(); // This will update the state in the parent component to remove the deleted flashcards
        })
        .catch((error) => {
          console.error("Error deleting flashcards:", error);
        });
    } else {
      console.log("No user logged in!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Delete All Flashcards</h2>
      <button
        onClick={handleDelete}
        className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete All Flashcards
      </button>
    </div>
  );
};

export default DeleteFlashcardForm;
