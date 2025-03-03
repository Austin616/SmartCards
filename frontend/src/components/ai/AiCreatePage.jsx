import React, { useState } from "react";
import axios from "axios";
import { HiArrowRight } from "react-icons/hi"; // Import arrow icon

const AiCreatePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [summary, setSummary] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [chatMessages, setChatMessages] = useState([]); 
  const [question, setQuestion] = useState(""); // Question state for user input

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type);

      // Handle text file
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result); // Store text content as preview
        reader.readAsText(file);
      } 
      
      // Handle PDF file (show a preview or file link)
      else if (file.type === "application/pdf") {
        setFilePreview(URL.createObjectURL(file)); // For PDF, show as object URL
      }
    }
  };

  const handleSummarizeText = async () => {
    if (!filePreview) return alert("Please upload a file first!");

    setLoading(true);
    setChatMessages([{
      type: "user",
      message: filePreview,
      timestamp: new Date().toLocaleTimeString(),
    }]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/summarize", {
        text: filePreview,
      });
      setSummary(response.data.summary);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          message: response.data.summary,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Error summarizing text:", error);
      setChatMessages([ 
        ...chatMessages,
        { 
          type: "ai", 
          message: "Error summarizing text.", 
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      setChatMessages([ 
        ...chatMessages, 
        { type: "user", message: question, timestamp: new Date().toLocaleTimeString() },
      ]);

      try {
        const response = await axios.post("http://127.0.0.1:5000/api/ask", {
          question: question,
          context: summary, // Send the summary as context
        });
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", message: response.data.answer, timestamp: new Date().toLocaleTimeString() },
        ]);
        setQuestion(""); // Clear the question input after submitting
      } catch (error) {
        console.error("Error answering question:", error);
        setChatMessages([ 
          ...chatMessages,
          { type: "ai", message: "Error answering question.", timestamp: new Date().toLocaleTimeString() },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-6 tracking-tight">
        Summarize Your Text
      </h1>
      <p className="text-center text-xl mb-6 text-gray-600">
        Upload a PDF or text file, and AI will summarize it for you.
      </p>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Upload PDF or Text File:
        </label>

        <div className="flex flex-col items-center w-full">
          <label className="w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 text-center rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-300">
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-gray-600 text-lg font-medium">
              Drag & Drop or Click to Upload
            </p>
            <p className="text-sm text-gray-500">PDF, TXT files are supported</p>
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mb-4">
          <p className="text-center text-lg font-medium text-blue-600">
            Uploaded: {selectedFile.name}
          </p>
        </div>
      )}

      {/* Display text file preview if it's a text file */}
      {fileType === "text/plain" && filePreview && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700">File Preview:</h2>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">{filePreview}</pre>
        </div>
      )}

      {/* Display PDF file preview as an embedded object or a link */}
      {fileType === "application/pdf" && filePreview && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-700">File Preview:</h2>
          <embed
            src={filePreview}
            width="100%"
            height="500px"
            type="application/pdf"
            alt="PDF Preview"
          />
        </div>
      )}

      {/* Conditionally render chat messages if there's at least one message */}
      {chatMessages.length > 0 && (
        <div className="overflow-auto max-h-80 p-4 border rounded-lg bg-gray-100 shadow-md mb-6">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-gray-500 block text-right mt-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filePreview && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSummarizeText}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {loading ? "Processing..." : "Summarize Text"}
          </button>
        </div>
      )}

      {/* Conditionally render the input for asking questions only if there's a summary */}
      {summary && (
        <div className="mt-6 relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleAskQuestion}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            placeholder="Ask a question about the summary..."
          />
          <button
            onClick={() => handleAskQuestion({ key: "Enter" })}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
          >
            <HiArrowRight size={24} />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-6">
          <p className="text-lg text-gray-600">Thinking...</p>
        </div>
      )}
    </div>
  );
};

export default AiCreatePage;