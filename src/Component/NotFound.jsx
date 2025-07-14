import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import NotFoundImage from '../assets/404.png'; // place an SVG or PNG in /assets

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-6">
      <img
        src={NotFoundImage}
        alt="Not Found Illustration"
        className="w-72 sm:w-96 mb-6"
      />
      <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        <FaHome className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
