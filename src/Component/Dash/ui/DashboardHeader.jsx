import React from 'react';
import { FaRocket, FaPlus, FaSearch } from 'react-icons/fa';

export default function DashboardHeader({ name, onCreateProject, onPostJob, onSearch }){
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm text-gray-500">Overview of your workspace</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input onChange={(e)=> onSearch && onSearch(e.target.value)} placeholder="Search projects or jobs..." className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm w-64" />
          <FaSearch className="absolute right-2 top-2 text-gray-400" />
        </div>
        <button onClick={onCreateProject} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"><FaPlus/> New Project</button>
        <button onClick={onPostJob} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><FaRocket/> Post Job</button>
      </div>
    </div>
  )
}
