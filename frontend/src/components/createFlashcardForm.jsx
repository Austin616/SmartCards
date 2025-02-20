import React, { useState } from 'react';
import axios from 'axios';

const CreateFlashcardForm = ({ onAddFlashcard }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the flashcard data
    const newFlashcard = { question, answer, category };

    // Send a POST request to create a new flashcard
    axios.post('http://127.0.0.1:5000/api/flashcards', newFlashcard)
      .then((response) => {
        // If the flashcard was created successfully, call the parent callback
        onAddFlashcard(newFlashcard);
        // Reset the form fields
        setQuestion('');
        setAnswer('');
        setCategory('');
      })
      .catch((error) => {
        console.error('Error creating flashcard:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Create Flashcard</h2>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">Answer:</label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
  );
};

export default CreateFlashcardForm;
