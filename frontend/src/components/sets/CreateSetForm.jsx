import React, { useState } from 'react';
import axios from 'axios';

const CreateSetForm = ({ onAddSet }) => {
    const [setName, setSetName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info
        if (!user || !user.email) {
            console.error("User email not found!");
            return;
        }
    
        const newSet = { name: setName, user_email: user.email };
    
        axios
            .post('http://127.0.0.1:5000/api/sets', newSet)
            .then((response) => {
                onAddSet({ ...newSet, _id: response.data.set_id });
                setSetName("");
            })
            .catch((error) => {
                console.error("Error creating set:", error);
            });
    };
    

    return (
        <div className="max-w-lg mx-auto mb-8">
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-2 border-blue-400"
            >
                <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Create Set</h2>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700">Set Name:</label>
                    <input
                        type="text"
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Create Set
                </button>
            </form>
        </div>
    );
};

export default CreateSetForm;
