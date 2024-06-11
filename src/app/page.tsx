"use client";

import React, { useState } from "react";
import axios from "axios";

/**
 * Home component for the tweet sentiment analyzer.
 */

const Home = () => {
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  /**
   * Handles form submission to get the sentiment prediction
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text for analysis.");
      return;
    }
    setError(null);
    try {
      console.log("Sending request to API...");
      const response = await axios.post("/api/predict", { text });
      console.log("API response received:", response.data);

      const data = response.data;
      setPrediction(data.prediction);
      setConfidence(data.confidence);

      console.log("Prediction:", data.prediction);
      console.log("Confidence:", data.confidence);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("An error occurred while fetching the prediction.");
    }
  };

  return (
    <div className="p-5 max-w-xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="font-bold text-center text-2xl mb-5 text-grey-700"> Text Sentiment Analyzer</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          cols={50}
          placeholder="Enter text for sentiment analysis."
          className="w-full p-3 text-lg border-md mb-3"
        />

        <button
          type="submit"
         className="mt-3 px-5 py-2 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 active:bg-blue-700 transition-all duration-200"
        >
          Analyze
        </button>
      </form>

      {error && <div className="text-red-500 mt-3" >{error}</div>}
      {prediction && (
        <div className="mt-5 text-center">
          <h2 className="text-xl font-semibold"> Prediction: {prediction}</h2>
          {confidence !== null && (
            <p className="text-lg">Confidence: {(confidence * 100).toFixed(2)}%</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
