import { Link } from "react-router-dom";

const HomePage = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Welcome to the Smart Cards!
      </h1>
      <p className="text-center text-lg">
        Your personal flashcard application for learning and memorization.
      </p>
      {user ? (
        <>
          <p className="text-center text-lg">Let's get started, {user.name}!</p>
          <p className="text-center text-lg">
            You are logged in as {user.email}
          </p>
          <div className="flex justify-center mt-6">
            <Link
              to="/dashboard"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-lg">
            Please sign in to access your flashcards.
          </p>
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
    </div>
  );
};

export default HomePage;
