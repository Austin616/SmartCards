import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateFlashcardForm from './CreateFlashcardForm';

const SetDetailsPage = () => {
  const { setId } = useParams();
  const [setName, setSetName] = useState("");
  const [flashcards, setFlashcards] = useState([]); // Track the created flashcards
  const [flashcardCreated, setFlashcardCreated] = useState(false); // Track the status of creation

  useEffect(() => {
    if (setId) {
      axios
        .get(`http://127.0.0.1:5000/api/sets/${setId}`)
        .then((response) => setSetName(response.data.name))
        .catch((error) => console.error('Error fetching set details:', error));
    }
  }, [setId]);

  const handleFlashcardCreation = (newFlashcard) => {
    setFlashcards((prevFlashcards) => [...prevFlashcards, newFlashcard]);
    setFlashcardCreated(true);
    setTimeout(() => setFlashcardCreated(false), 2000); // Reset success message after 2 seconds
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Create Flashcards for Set: {setName || "Loading..."}
      </h1>

      <CreateFlashcardForm setId={setId} onAddFlashcard={handleFlashcardCreation} />

      {flashcardCreated && (
        <div className="mt-4 text-green-500 font-semibold">
          Successfully Created!
        </div>
      )}

      <div className="mt-4 w-full">
        {flashcards.map((flashcard, index) => (
          <div key={index} className="p-2 border rounded-lg mb-2 bg-gray-100">
            <p className="text-lg font-medium">{flashcard.question}</p>
            <p className="text-sm text-gray-600">{flashcard.answer}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete all flashcards for this set?")) {
            axios.delete(`http://127.0.0.1:5000/api/sets/${setId}/flashcards`)
              .then(() => alert("All flashcards deleted."))
              .catch((error) => console.error("Error deleting flashcards:", error));
          }
        }}
        className="w-full p-2 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Delete All Flashcards
      </button>
    </div>
  );
};

export default SetDetailsPage;
