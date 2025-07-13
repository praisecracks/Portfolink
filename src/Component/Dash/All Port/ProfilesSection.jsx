import React, { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaCopy,
  FaUserCircle,
} from "react-icons/fa";
import EditProfileForm from "./EditProfileForm";

function ProfileSection({
  profileData,
  isEditing,
  onEditClick,
  onSave,
  onCancel,
  publicLink,
  copyToClipboard,
  copySuccess,
}) {
  if (!profileData) return null;

  if (isEditing) {
    return (
      <EditProfileForm
        profileData={profileData}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <section className="text-center px-4 py-8">
      {/* Avatar */}
      <div className="flex flex-col items-center space-y-3">
        <FaUserCircle className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium">
          {profileData.title}
        </p>
        <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
          {profileData.bio}
        </p>
      </div>

      {/* Public link copy */}
      <div className="mt-6 flex justify-center items-center gap-3 flex-wrap bg-indigo-50 dark:bg-gray-800 p-3 rounded-md border dark:border-gray-700">
        <a
          href={publicLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-700 dark:text-indigo-300 underline truncate font-medium"
        >
          {publicLink}
        </a>
        <button
          onClick={() => copyToClipboard(publicLink)}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
          title="Copy"
        >
          <FaCopy />
        </button>
        {copySuccess && (
          <span className="text-green-600 dark:text-green-400 text-sm">Copied!</span>
        )}
      </div>

      {/* Social Links */}
      <div className="mt-6 flex justify-center gap-5 text-2xl text-indigo-600 dark:text-indigo-400">
        {profileData.socialLinks?.github && (
          <a href={profileData.socialLinks.github} target="_blank" rel="noreferrer" title="GitHub">
            <FaGithub />
          </a>
        )}
        {profileData.socialLinks?.linkedin && (
          <a href={profileData.socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
            <FaLinkedin />
          </a>
        )}
        {profileData.socialLinks?.twitter && (
          <a href={profileData.socialLinks.twitter} target="_blank" rel="noreferrer" title="Twitter">
            <FaTwitter />
          </a>
        )}
        {profileData.socialLinks?.instagram && (
          <a href={profileData.socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram">
            <FaInstagram />
          </a>
        )}
      </div>

      {/* Skills */}
      <div className="mt-10 text-left">
        <h3 className="text-xl font-semibold mb-3">Skills</h3>
        {profileData.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
        )}
      </div>

      {/* Education */}
      <div className="mt-10 text-left">
        <h3 className="text-xl font-semibold mb-4">Education</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {!profileData.education?.length ? (
            <p className="text-gray-500 dark:text-gray-400">No education history added.</p>
          ) : (
            profileData.education.map((edu, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-900 shadow-sm"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                <p className="text-indigo-700 dark:text-indigo-300">{edu.school}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{edu.years}</p>
                {edu.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic whitespace-pre-line mt-2">
                    {edu.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Button */}
      <div className="mt-10">
        <button
          onClick={onEditClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md shadow transition"
        >
         Edit Portfolio
        </button>
      </div>
    </section>
  );
}

export default ProfileSection;
