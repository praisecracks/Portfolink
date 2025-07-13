import React from 'react';

function ResumeProjects({ projects }) {
  return (
    <section className="mb-6 border-b pb-4">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-sm text-gray-500">No projects listed.</p>
      ) : (
        projects.map((proj) => (
          <div key={proj.id} className="mb-3">
            <p className="font-semibold">{proj.title}</p>
            <p className="text-sm text-gray-600">{proj.description}</p>
            {proj.github && (
              <a
                href={proj.github}
                className="text-sm text-indigo-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                GitHub: {proj.github}
              </a>
            )}
          </div>
        ))
      )}
    </section>
  );
}

export default ResumeProjects;
