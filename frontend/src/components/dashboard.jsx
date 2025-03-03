import React from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Welcome to Smart Cards!
      </h1>
      <p className="text-center text-lg">
        Your personal flashcard application for learning and memorization.
      </p>

      {user ? (
        <>
          <p className="text-center text-lg">Let's get started, {user.name}!</p>
          <p className="text-center text-lg">You are logged in as {user.email}</p>
          <div className="flex justify-center mt-6">
            <Link
              to="/create"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-lg">Please sign in to access your flashcards.</p>
          <div className="flex justify-center mt-6">
            <Link
              to="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Sign In
            </Link>
          </div>
        </>
      )}

      {/* Dashboard Options */}
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Dashboard</h2>

        <div className="space-y-4 w-full">
          <Link
            to="/review"
            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Review Sets
          </Link>
          <Link
            to="/create"
            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Create Custom Set
          </Link>
          <Link
            to="/ai-sets"
            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Let AI Create Set
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
