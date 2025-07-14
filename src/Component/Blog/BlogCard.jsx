import React from "react";

function BlogCard({ title, description }) {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition duration-300">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">{title}</h3>
      <p className="text-sm whitespace-pre-line text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default BlogCard;
