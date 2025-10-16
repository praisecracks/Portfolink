import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaEye } from 'react-icons/fa';

export default function ProjectCard({ project, onOpen }) {
  const thumb = project.imageURL || project.images?.[0] || '';

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer rounded-xl p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/10 dark:border-gray-700 shadow-md hover:shadow-xl transition"
      onClick={() => onOpen && onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen && onOpen(project); }}
    >
      <div className="relative rounded-md overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={project.title || 'Project thumbnail'} loading="lazy" className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <FaEye className="text-3xl text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 flex items-start justify-end p-2">
          {project.liveURL && (
            <a href={project.liveURL} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="bg-indigo-600 text-white px-2 py-1 rounded text-xs mr-2 hover:opacity-90">
              <FaExternalLinkAlt className="inline-block mr-1" /> Live
            </a>
          )}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-md font-semibold text-indigo-700 dark:text-indigo-300">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description?.slice(0, 100) || 'No description'}</p>
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.map((t, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
