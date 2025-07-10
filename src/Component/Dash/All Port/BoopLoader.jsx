// BoopLoader.jsx
import React from 'react';
import { FaRocket } from 'react-icons/fa';

function BoopLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="animate-bounce text-indigo-600 dark:text-indigo-400 text-5xl">
        <FaRocket />
      </div>
    </div>
  );
}

export default BoopLoader;
