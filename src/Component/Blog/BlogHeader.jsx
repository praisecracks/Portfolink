import React from "react";

function BlogHeader({ title, subtitle }) {
  return (
    <header className="text-center max-w-3xl mx-auto mb-16">
      <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
    </header>
  );
}

export default BlogHeader;
