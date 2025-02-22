import React, { useState } from "react";
import axios from "axios";

const CreateFlashcardForm = ({ onAddFlashcard }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user")); // Get user info
    if (!storedUser || !storedUser.email) {
      console.error("User email not found");
      return;
    }

    const newFlashcard = {
      question,
      answer,
      category,
      user_email: storedUser.email, // Send user email to backend
    };

    axios
      .post("http://127.0.0.1:5000/api/flashcards", newFlashcard)
      .then((response) => {
        onAddFlashcard(newFlashcard);
        setQuestion("");
        setAnswer("");
        setCategory("");
        setSuccessMessage("Flashcard created successfully! ✅");

        // Remove success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 1000);
      })
      .catch((error) => {
        console.error("Error creating flashcard:", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-2 border-blue-400 mb-4"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Create Flashcard</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Question:
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Answer:
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Create Flashcard
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <p className="text-center text-green-600 font-semibold bg-green-100 p-2 rounded-lg">
          {successMessage}
        </p>
      )}
    </div>
  );
};

export default CreateFlashcardForm;
