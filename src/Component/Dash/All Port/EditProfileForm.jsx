import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';


function EditProfileForm({ profileData, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...profileData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e) => {
    setFormData({ ...formData, skills: e.target.value.split(',').map(skill => skill.trim()) });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...(formData.education || [])];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...(formData.education || []), { degree: '', school: '', years: '', note: '' }]
    });
  };

  const removeEducation = (index) => {
    const updated = [...formData.education];
    updated.splice(index, 1);
    setFormData({ ...formData, education: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md p-6 border border-indigo-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Edit Profile</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className="dark:border-gray-600 w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="dark:border-gray-600 w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Bio</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={handleChange}
            className="dark:border-gray-600 w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white resize-y"
          />
        </div>

{/* Social Links Section */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Social Links</label>
  <div className="space-y-3">

    {/* GitHub */}
    <div className="flex items-center gap-2">
      <FaGithub className="text-xl text-gray-700 dark:text-white" />
      <input
        type="url"
        name="github"
        placeholder="GitHub URL (optional)"
        value={formData.socialLinks?.github || ''}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              github: e.target.value,
            },
          }))
        }
        className="w-full p-2 border rounded dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white"
      />
    </div>

    {/* LinkedIn */}
    <div className="flex items-center gap-2">
      <FaLinkedin className="text-xl text-gray-700 dark:text-white" />
      <input
        type="url"
        name="linkedin"
        placeholder="LinkedIn URL (optional)"
        value={formData.socialLinks?.linkedin || ''}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              linkedin: e.target.value,
            },
          }))
        }
        className="w-full p-2 border rounded dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white"
      />
    </div>

    {/* Twitter */}
    <div className="flex items-center gap-2">
      <FaTwitter className="text-xl text-gray-700 dark:text-white" />
      <input
        type="url"
        name="twitter"
        placeholder="Twitter URL (optional)"
        value={formData.socialLinks?.twitter || ''}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              twitter: e.target.value,
            },
          }))
        }
        className="w-full p-2 border rounded dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white"
      />
    </div>

    {/* Instagram */}
    <div className="flex items-center gap-2">
      <FaInstagram className="text-xl text-gray-700 dark:text-white" />
      <input
        type="url"
        name="instagram"
        placeholder="instagram URL (optional)"
        value={formData.socialLinks?.instagram || ''}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              instagram: e.target.value,
            },
          }))
        }
        className="w-full p-2 border rounded dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white"
      />
    </div>

  </div>
</div>


        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Skills (comma-separated)</label>
          <input
            type="text"
            value={(formData.skills || []).join(', ')}
            onChange={handleSkillChange}
            className="dark:border-gray-600 w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
            placeholder="e.g., JavaScript, Firebase, Tailwind"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Education</label>
          {(formData.education || []).map((edu, index) => (
            <div key={index} className="border p-3 rounded mb-3 dark:border-gray-600">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="School"
                value={edu.school}
                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Years"
                value={edu.years}
                onChange={(e) => handleEducationChange(index, 'years', e.target.value)}
                className="w-full mb-2 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Note(Optional)"
                rows={2}
                value={edu.note}
                onChange={(e) => handleEducationChange(index, 'note', e.target.value)}
                className=" dark:border-gray-600 w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white resize-y"
              />
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="mt-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
          >
            ➕ Add Education
          </button>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"> Save</button>
          <button type="button" onClick={onCancel} className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-700">❌ Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
