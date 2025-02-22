import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateFlashcardForm from './CreateFlashcardForm';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const SetDetailsPage = ({ user }) => {
  const { setId } = useParams(); // Get the setId from URL params
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");  // New state to store the set name
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (setId) {
      // Fetch set details to get the name
      axios
        .get(`http://127.0.0.1:5000/api/sets/${setId}`)
        .then((response) => {
          setSetName(response.data.name);  // Store the set name
        })
        .catch((error) => {
          console.error('Error fetching set details:', error);
        });

      // Fetch flashcards for the set by its ID
      axios
        .get(`http://127.0.0.1:5000/api/sets/${setId}/flashcards`)
        .then((response) => {
          setFlashcards(response.data);
        })
        .catch((error) => {
          console.error('Error fetching flashcards:', error);
        });
    }
  }, [setId]); // The hook depends on the setId to refetch when it changes

  const handleAddFlashcard = (newFlashcard) => {
    setFlashcards([...flashcards, newFlashcard]);
  };

  const handleDeleteFlashcards = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all flashcards for this set? This action cannot be undone.");
    if (confirmDelete) {
      axios
        .delete(`http://127.0.0.1:5000/api/sets/${setId}/flashcards`)
        .then((response) => {
          setFlashcards([]); // Clear the flashcards in the UI after deletion
          alert(response.data.message);
        })
        .catch((error) => {
          console.error("Error deleting flashcards:", error);
        });
    }
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Flashcards for Set: {setName || "Loading..."}
      </h1>

      {/* Form to create flashcards for this set */}
      <CreateFlashcardForm setId={setId} onAddFlashcard={handleAddFlashcard} />

      {/* Delete button for this set */}
      <button
        onClick={handleDeleteFlashcards}
        className="w-full p-2 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete All Flashcards for This Set
      </button>

      {flashcards.length > 0 ? (
        <div className="flex flex-col items-center mt-6">
          {/* Flashcard Display */}
          <div
            className="flashcard-container"
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
              {!flipped ? (
                <div className="front p-6 border rounded-lg shadow-md text-center bg-white relative">
                  <h3 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-900 bg-blue-200 rounded-full px-2">
                    Question
                  </h3>
                  <p className="text-gray-900 mt-6">
                    {flashcards[currentIndex].question}
                  </p>
                </div>
              ) : (
                <div className="back p-6 border rounded-lg shadow-md text-center bg-white relative">
                  <h3 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-100 bg-blue-300 rounded-full px-2">
                    Answer
                  </h3>
                  <p className="text-gray-100 mt-6">
                    {flashcards[currentIndex].answer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between w-40 mt-4">
            <button
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={handlePrev}
            >
              <FaArrowLeft size={20} />
            </button>
            <button
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={handleNext}
            >
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No flashcards found for this set.</p>
      )}
    </div>
  );
};

export default SetDetailsPage;
