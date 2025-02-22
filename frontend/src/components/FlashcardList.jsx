import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateFlashcardForm from "./CreateFlashcardForm";
import DeleteFlashcardForm from "./DeleteFlashcardForm";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const FlashcardList = ({ user }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`http://127.0.0.1:5000/api/flashcards?user_email=${user.email}`)
        .then((response) => {
          setFlashcards(response.data);
        })
        .catch((error) => {
          console.error("Error fetching flashcards:", error);
        });
    }
  }, [user]);

  const handleAddFlashcard = (newFlashcard) => {
    setFlashcards([...flashcards, newFlashcard]);
  };

  const handleDeleteFlashcard = () => {
    setFlashcards([]);
    setCurrentIndex(0);
    setFlipped(false);
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
        Flashcards
      </h1>
      <CreateFlashcardForm onAddFlashcard={handleAddFlashcard} />
      <DeleteFlashcardForm
        onDeleteFlashcard={handleDeleteFlashcard}
        user={user}
      />

      {flashcards.length > 0 ? (
        <div className="flex flex-col items-center mt-6">
          {/* Flashcard */}
          <div
            className="flashcard-container"
            onClick={() => setFlipped(!flipped)}
          >
            <div
              className="flashcard-container"
              onClick={() => setFlipped(!flipped)}
            >
              <div className={`flashcard ${flipped ? "flipped" : ""}`}>
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
        <p className="text-center text-gray-500">No flashcards found.</p>
      )}
    </div>
  );
};

export default FlashcardList;
