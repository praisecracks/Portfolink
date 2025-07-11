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
}) {
  const [copySuccess, setCopySuccess] = useState(false);
  if (!profileData) return null;

  const publicLink = `${window.location.origin}/portfolio/${profileData.uid}`;

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

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
    <section className="max-w-5xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Icon Avatar + Name + Title */}
      <div className="flex flex-col items-center space-y-4">
        <div className="text-indigo-600 dark:text-indigo-400">
          <FaUserCircle className="w-28 h-28 md:w-32 md:h-32" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {profileData.fullName}
        </h1>
        <p className="text-indigo-600 dark:text-indigo-400 text-lg font-medium">
          {profileData.title}
        </p>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl text-sm sm:text-base whitespace-pre-line">
          {profileData.bio}
        </p>
      </div>

      {/* Public Link */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 p-3 rounded-lg">
        <a
          href={publicLink}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate underline text-indigo-700 dark:text-indigo-300 font-medium"
        >
          {publicLink}
        </a>
        <button
          onClick={() => copyToClipboard(publicLink)}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 text-lg"
          title="Copy public link"
        >
          <FaCopy />
        </button>
        {copySuccess && (
          <span className="text-green-600 dark:text-green-400 ml-2 text-sm">
            Copied!
          </span>
        )}
      </div>

      {/* Social Links */}
      <div className="flex justify-center mt-6 space-x-6 text-2xl text-indigo-600 dark:text-indigo-400">
        {profileData.socialLinks?.github && (
          <a
            href={profileData.socialLinks.github}
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            className="hover:text-black dark:hover:text-white transition"
          >
            <FaGithub />
          </a>
        )}
        {profileData.socialLinks?.linkedin && (
          <a
            href={profileData.socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn"
            className="hover:text-blue-600 transition"
          >
            <FaLinkedin />
          </a>
        )}
        {profileData.socialLinks?.twitter && (
          <a
            href={profileData.socialLinks.twitter}
            target="_blank"
            rel="noreferrer"
            title="Twitter"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>
        )}
        {profileData.socialLinks?.instagram && (
          <a
            href={profileData.socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            title="Instagram"
            className="hover:text-pink-500 transition"
          >
            <FaInstagram />
          </a>
        )}
      </div>

      {/* Skills */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {profileData.skills?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No skills added yet
            </p>
          ) : (
            profileData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white text-xs font-semibold px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Education */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Education
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {profileData.education?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No education history added
            </p>
          ) : (
            profileData.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-1 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {edu.degree}
                </h4>
                <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                  {edu.school}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {edu.years}
                </p>
                {edu.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic whitespace-pre-line">
                    {edu.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Button */}
      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onEditClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow transition duration-200"
        >
          Edit Portfolio
        </button>
      </div>
    </section>
  );
}

export default ProfileSection;
