import React, { useState } from "react";

const AiCreatePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileType(file.type);

      if (file.type === "text/plain") {
        // Read and display text file content
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        // Create an object URL for PDF preview
        setFilePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleGenerateCards = () => {
    alert("Generating cards from the uploaded file...");
    // Here you would trigger the function to generate flashcards
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Create AI Sets
      </h1>
      <p className="text-center text-lg mb-6 text-gray-600">
        Upload a PDF or text file, and AI will generate flashcard sets for you!
      </p>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="text-lg font-medium text-gray-700 mb-2">
          Upload PDF or Text File:
        </label>

        <div className="flex flex-col items-center w-full">
          <label className="w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 text-center rounded-lg hover:border-blue-500 transition">
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-gray-600">Drag & Drop or Click to Upload</p>
            <p className="text-sm text-gray-500">PDF, TXT files are supported</p>
          </label>
        </div>
      </div>

      {/* Display the uploaded file name */}
      {selectedFile && (
        <div className="mb-4">
          <p className="text-center text-lg font-medium text-blue-600">
            Uploaded: {selectedFile.name}
          </p>
        </div>
      )}

      {/* File Preview Section */}
      {filePreview && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 w-full text-center shadow-md">
          <p className="text-lg font-medium text-gray-800 mb-2">File Preview:</p>
          {fileType === "text/plain" ? (
            <pre className="text-sm text-left p-2 bg-white border rounded overflow-auto max-h-60">
              {filePreview}
            </pre>
          ) : fileType === "application/pdf" ? (
            <iframe
              src={filePreview}
              title="PDF Preview"
              className="w-full h-80 border rounded-lg shadow-md"
            ></iframe>
          ) : (
            <p className="text-red-500">Unsupported file type.</p>
          )}
        </div>
      )}

      {/* Generate Cards Button */}
      {filePreview && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGenerateCards}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition"
          >
            Generate Cards
          </button>
        </div>
      )}
    </div>
  );
};

export default AiCreatePage;
