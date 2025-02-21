import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateFlashcardForm from "./CreateFlashcardForm";
import DeleteFlashcardForm from "./DeleteFlashcardForm";

const FlashcardList = ({ user }) => {
  const [flashcards, setFlashcards] = useState([]); // State to hold flashcards

  // Fetch flashcards for the logged-in user
  useEffect(() => {
    // Make sure the user object is not empty and has the email
    if (user && user.email) {
      axios
        .get(`http://127.0.0.1:5000/api/flashcards?user_email=${user.email}`)
        .then((response) => {
          setFlashcards(response.data);
        })
        .catch((error) => {
          console.error("Error fetching flashcards:", error);
        });
    } else {
      console.error("User email is not available.");
    }
  }, [user]);
  
  // Add new flashcard to the state
  const handleAddFlashcard = (newFlashcard) => {
    setFlashcards([...flashcards, newFlashcard]);
  };

  // Delete all flashcards from the state
  const handleDeleteFlashcard = () => {
    setFlashcards([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Flashcards</h1>
      <CreateFlashcardForm onAddFlashcard={handleAddFlashcard} />
      <ul className="space-y-4 mt-6">
        <DeleteFlashcardForm onDeleteFlashcard={handleDeleteFlashcard} user={user} />
        {flashcards.length > 0 ? (
          flashcards.map((card) => (
            <li
              key={card.id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div className="flex flex-col space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  <strong>Q:</strong> {card.question}
                </p>
                <p className="text-lg text-gray-600">
                  <strong>A:</strong> {card.answer}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Category:</strong> {card.category}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No flashcards found.</p>
        )}
      </ul>
    </div>
  );
};

export default FlashcardList;
