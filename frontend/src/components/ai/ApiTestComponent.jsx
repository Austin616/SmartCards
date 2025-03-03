import React, { useState } from "react";
import axios from "axios";

const ApiTestComponent = () => {
  const [loading, setLoading] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);

  // Function to test the OpenAI API key
  const testApiKey = async () => {
    setLoading(true);
    setApiTestResult(null);

    try {
      // Make the GET request to the Flask API
      const response = await axios.get("http://127.0.0.1:5000/api/test");

      // If the request is successful, display the message
      setApiTestResult(response.data.message);
    } catch (error) {
      // Handle errors and show the error message
      setApiTestResult(error.response ? error.response.data.error : "API Key is invalid or server error!");
    } finally {
      setLoading(false);
    }

    // Clear the result after 5 seconds
    setTimeout(() => {
      setApiTestResult(null);
    }, 5000);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Test OpenAI API Key
      </h1>
      <p className="text-center text-lg mb-6 text-gray-600">
        Click below to test the OpenAI API key.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={testApiKey}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
          disabled={loading}
        >
          {loading ? "Testing..." : "Test API Key"}
        </button>
      </div>

      {apiTestResult && (
        <p className={`text-center text-lg ${apiTestResult.includes("working") ? "text-green-600" : "text-red-600"}`}>
          {apiTestResult}
        </p>
      )}
    </div>
  );
};

export default ApiTestComponent;
