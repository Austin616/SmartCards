import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateSetForm from "./CreateSetForm";
import axios from "axios";

const CreatePage = () => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
    if (!user || !user.email) return;

    axios.get(`http://127.0.0.1:5000/api/sets?user_email=${user.email}`)
        .then((response) => {
            const validSets = response.data.filter(set => set._id && set._id !== "undefined");
            setSets(validSets);
            localStorage.setItem("sets", JSON.stringify(validSets));
        })
        .catch((error) => {
            console.error("Error fetching sets:", error);
        });
}, []);


  // Function to handle adding a new set
  const handleAddSet = (newSet) => {
    if (newSet._id) {
      const updatedSets = [...sets, newSet];
      setSets(updatedSets);
      localStorage.setItem("sets", JSON.stringify(updatedSets)); // Persist new set in localStorage
    } else {
      console.error("Attempted to add set without valid _id", newSet);
    }
  };

  // Function to handle deleting a set
  const handleDeleteSet = (setId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) return;

    axios
        .delete(`http://127.0.0.1:5000/api/sets/${setId}?user_email=${user.email}`)
        .then(() => {
            return axios.get(`http://127.0.0.1:5000/api/sets?user_email=${user.email}`);
        })
        .then((response) => {
            const validSets = response.data.filter(set => set._id && set._id !== "undefined");
            setSets(validSets);
            localStorage.setItem("sets", JSON.stringify(validSets));
        })
        .catch((error) => {
            console.error("Error deleting set:", error);
        });
};


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Flashcards</h1>
      <CreateSetForm onAddSet={handleAddSet} />
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Sets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map((set) => (
            // Ensure each set has a valid name
            set.name && set.name.trim() !== "" && (
              <div key={set._id} className="relative group"> {/* Use group for hover effect */}
                <Link
                  to={`/sets/${set._id}`}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-2 border-blue-400 p-4 block"
                >
                  <div className="text-xl font-bold text-blue-600 hover:text-blue-700">
                    {set.name}
                  </div>
                </Link>
                
                {/* Delete button is hidden by default, shown on hover */}
                <button
                  onClick={() => handleDeleteSet(set._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Delete
                </button>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
