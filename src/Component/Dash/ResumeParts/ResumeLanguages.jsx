import React from 'react';

function ResumeLanguages({ profile, editMode, setProfile }) {
  const handleChange = (value) => {
    setProfile((prev) => ({
      ...prev,
      languages: value.split(',').map((l) => l.trim()),
    }));
  };

  return (
    <section className="mb-6 border-b pb-4">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Languages</h2>
      {editMode ? (
        <textarea
          placeholder="e.g. English, Spanish"
          value={profile.languages?.join(', ') || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border p-2 text-sm"
        />
      ) : (
        <p className="text-sm">{profile.languages?.join(', ') || 'No languages listed.'}</p>
      )}
    </section>
  );
}

export default ResumeLanguages;
