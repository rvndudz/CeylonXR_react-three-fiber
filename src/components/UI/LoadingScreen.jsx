import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Helper function to format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
};

const LoadingScreen = ({
  progress = 0,
  placeName = "Loading...",
  doYouKnowTexts = [],
  loadedSize = 0,
  totalSize = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (doYouKnowTexts.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % doYouKnowTexts.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [doYouKnowTexts]);

  const currentText =
    doYouKnowTexts.length > 0 ? doYouKnowTexts[currentIndex] : "";

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center">
      <motion.h1
        className="special-font hero-heading text-blue-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {placeName}
      </motion.h1>

      {/* Thinner Progress Bar */}
      <div className="w-11/12 max-w-lg bg-gray-700 h-2 rounded-full overflow-hidden shadow-lg mb-4">
        <motion.div
          className="h-full bg-blue-600"
          style={{ width: `${progress * 100}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        />
      </div>

      {/* Download Progress */}
      <p className="text-sm text-gray-300">
        <strong>Downloading:</strong> {formatBytes(loadedSize)} /{" "}
        {formatBytes(totalSize)}
      </p>

      {/* Did You Know Section */}
      {currentText && (
        <motion.div
          className="mt-6 px-6 py-3 bg-gray-800 bg-opacity-70 rounded-xl shadow-lg w-11/12 max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-gray-200">
            <strong>Did You Know?</strong> {currentText}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingScreen;
