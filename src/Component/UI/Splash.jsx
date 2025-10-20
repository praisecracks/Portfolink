import React from 'react';

export default function Splash(){
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 animate-pulse mb-4 flex items-center justify-center text-white font-bold">PF</div>
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading Portfolink...</p>
      </div>
    </div>
  )
}
