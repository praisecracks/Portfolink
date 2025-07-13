// src/components/RocketLoader.jsx
import React from "react";

const RocketLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-16 h-16 border-4 border-t-indigo-600 border-b-indigo-600 border-l-transparent border-r-transparent rounded-full animate-spin-variable"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
        Your project is loading
      </p>
    </div>
  );
};

export default RocketLoader;
