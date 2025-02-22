import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ReviewPage = () => {
  const { setId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [setName, setSetName] = useState("");

  useEffect(() => {
    if (setId) {
      axios.get(`http://127.0.0.1:5000/api/sets/${setId}`)
        .then((response) => setSetName(response.data.name))
        .catch((error) => console.error("Error fetching set details:", error));

      axios.get(`http://127.0.0.1:5000/api/sets/${setId}/flashcards`)
        .then((response) => setFlashcards(response.data))
        .catch((error) => console.error("Error fetching flashcards:", error));
    }
  }, [setId]);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Reviewing Set: {setName || "Loading..."}
      </h1>

      {flashcards.length > 0 ? (
        <>
          {/* Flashcard */}
          <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
            <div className={`flashcard ${flipped ? "flipped" : ""}`}>
              <div className="front">
                <h3 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-900 bg-blue-200 rounded-full px-2">
                  Question
                </h3>
                <p className="text-gray-900 mt-6">
                  {flashcards[currentIndex].question}
                </p>
              </div>

              <div className="back">
                <h3 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-100 bg-blue-300 rounded-full px-2">
                  Answer
                </h3>
                <p className="text-gray-100 mt-6">
                  {flashcards[currentIndex].answer}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between w-40 mt-4">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={handlePrev}>
              <FaArrowLeft size={20} />
            </button>
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={handleNext}>
              <FaArrowRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6">No flashcards found for this set.</p>
      )}
    </div>
  );
};

export default ReviewPage;
