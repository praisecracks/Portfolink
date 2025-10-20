import React from 'react';

export default function QuickAction({ icon, title, subtitle, onClick }){
  return (
    <button onClick={onClick} className="flex flex-col items-start gap-1 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
      <div className="text-indigo-600">{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </button>
  )
}
