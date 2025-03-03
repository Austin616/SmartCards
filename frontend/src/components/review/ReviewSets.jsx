import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ReviewSets = () => {
    const [sets, setSets] = useState([]);
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      if (!user || !user.email){
        console.error("User email not found!");
        return;
      }
      // Fetch sets from the backend
      fetch("http://127.0.0.1:5000/api/sets?user_email=" + user.email)
        .then((response) => response.json())
        .then((data) => {
          // Filter out sets that have undefined IDs or empty names
          const validSets = data.filter(set => set._id && set.name && set.name.trim() !== "");
          setSets(validSets);
        })
        .catch((error) => console.error("Error fetching sets:", error));
    }, []);
  
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Review Flashcards</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            <Link
              key={set._id}
              to={`/review/${set._id}`}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-2 border-blue-400 p-4 block text-center font-bold text-blue-600"
            >
              {set.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };
  

export default ReviewSets;