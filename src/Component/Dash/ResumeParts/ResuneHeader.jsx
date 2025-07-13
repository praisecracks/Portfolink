import React from 'react';
import Profile from '../../../assets/profile.png';
import templateStyles from './templateStyles';

function ResumeHeader({ profile, editMode, setProfile, selectedTemplate }) {
  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const styles = templateStyles[selectedTemplate] || {};

  return (
    <div className={`flex flex-col md:flex-row items-center md:items-start md:space-x-6 text-center md:text-left mb-8 p-4 rounded ${styles.headerBg}`}>
      <img
        src={profile.photoURL?.trim() || Profile}
        alt="Profile"
        className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-indigo-600"
      />
      <div className="mt-4 md:mt-0 w-full">
        {editMode ? (
          <>
            <input
              placeholder="Full Name"
              value={profile.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="block w-full text-xl font-bold border-b mb-1"
            />
            <input
              placeholder="Job Title"
              value={profile.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="block w-full text-indigo-600 text-sm border-b mb-2"
            />
            <textarea
              placeholder="Short bio..."
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="text-gray-700 text-sm border rounded p-2 w-full"
            />
          </>
        ) : (
          <>
            <h1 className={`text-2xl font-bold ${styles.headerText}`}>{profile.fullName}</h1>
            <p className={`font-medium ${styles.headerText}`}>{profile.title}</p>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">{profile.bio}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ResumeHeader;
