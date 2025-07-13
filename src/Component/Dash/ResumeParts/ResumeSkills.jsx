import React from 'react';

function ResumeSkills({ profile, editMode, setProfile }) {
  const handleChange = (value) => {
    setProfile((prev) => ({
      ...prev,
      skills: value.split(',').map((s) => s.trim()),
    }));
  };

  return (
    <section className="mb-6 border-b pb-4">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Skills</h2>
      {editMode ? (
        <textarea
          placeholder="e.g. React, Firebase, Tailwind"
          value={profile.skills?.join(', ') || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border rounded p-2 text-sm"
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {profile.skills?.map((skill, i) => (
            <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs md:text-sm">
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default ResumeSkills;