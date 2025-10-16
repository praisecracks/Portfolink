import React, { useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProjectLightbox({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;

  const imgs = project.images && project.images.length ? project.images : (project.imageURL ? [project.imageURL] : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <button className="absolute top-3 right-3 text-xl text-gray-200" onClick={onClose}><FaTimes /></button>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{project.title}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-300">{project.tags?.join(' · ')}</div>
        </div>

        <div className="p-4">
          {imgs.length ? (
            <img src={imgs[0]} alt={project.title} className="w-full h-96 object-contain bg-black" />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800">No preview available</div>
          )}

          <div className="mt-4 p-2 text-sm text-gray-700 dark:text-gray-300">{project.description}</div>

          <div className="flex gap-2 mt-4 p-2">
            {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded">View Code</a>}
            {project.liveURL && <a href={project.liveURL} target="_blank" rel="noreferrer" className="px-3 py-2 bg-indigo-600 text-white rounded">Live Demo</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
