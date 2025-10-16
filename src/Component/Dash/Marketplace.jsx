import React from 'react';
import { FaTools } from 'react-icons/fa';

export default function marketplace() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <FaTools size={50} className="text-indigo-500 animate-bounce mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Marketplace
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        Currently under construction. Our developers are working on this feature 🚀.
      </p>
    </div>
  );
}
