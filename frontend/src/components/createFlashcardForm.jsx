import React, { useState } from "react";
import axios from "axios";

const CreateFlashcardForm = ({ setId, onAddFlashcard }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

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
      user_email: storedUser.email,
      set_id: setId, // Pass selected set_id here
    };
  
    axios
      .post("http://127.0.0.1:5000/api/flashcards", newFlashcard)
      .then((response) => {
        // Ensure that the response contains the flashcard with its _id
        const createdFlashcard = response.data; // Assuming the response contains the flashcard object with _id
        onAddFlashcard(createdFlashcard); // Callback to update parent component with the full flashcard object
        setQuestion("");
        setAnswer("");
        setCategory("");
      })
      .catch((error) => {
        console.error("Error creating flashcard:", error);
      });
  };
  

  return (
    <div className="max-w-lg mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-2 border-blue-400"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
          Create Flashcard
        </h2>

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

    </div>
  );
};

export default CreateFlashcardForm;
