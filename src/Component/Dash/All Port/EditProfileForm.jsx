import React, { useState } from 'react';
import {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram
} from 'react-icons/fa';

function EditProfileForm({ profileData, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...profileData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e) => {
    setFormData({
      ...formData,
      skills: e.target.value.split(',').map((skill) => skill.trim()),
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...(formData.education || [])];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...(formData.education || []), { degree: '', school: '', years: '', note: '' }],
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
    <div className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-indigo-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-6 text-center">Edit Your Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Your professional title (e.g. Web Developer)"
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder="A short bio about you"
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 resize-y"
          />
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Social Links</label>
          <div className="space-y-3">
            {[
              { name: 'github', icon: FaGithub, placeholder: 'GitHub URL' },
              { name: 'linkedin', icon: FaLinkedin, placeholder: 'LinkedIn URL' },
              { name: 'twitter', icon: FaTwitter, placeholder: 'Twitter URL' },
              { name: 'instagram', icon: FaInstagram, placeholder: 'Instagram URL' }
            ].map(({ name, icon: Icon, placeholder }) => (
              <div key={name} className="flex items-center gap-2">
                <Icon className="text-xl text-gray-600 dark:text-white" />
                <input
                  type="url"
                  name={name}
                  placeholder={placeholder}
                  value={formData.socialLinks?.[name] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [name]: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Skills <span className="text-xs text-gray-400">(comma separated)</span>
          </label>
          <input
            type="text"
            value={(formData.skills || []).join(', ')}
            onChange={handleSkillChange}
            placeholder="e.g. JavaScript, Firebase, Tailwind"
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Education Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Education</label>
          {(formData.education || []).map((edu, index) => (
            <div key={index} className="border p-4 rounded dark:border-gray-600 mb-4">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
              <input
                type="text"
                placeholder="School"
                value={edu.school}
                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
              <input
                type="text"
                placeholder="Years (e.g. 2019 - 2023)"
                value={edu.years}
                onChange={(e) => handleEducationChange(index, 'years', e.target.value)}
                className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
              />
              <textarea
                placeholder="Note (optional)"
                rows={2}
                value={edu.note}
                onChange={(e) => handleEducationChange(index, 'note', e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 resize-y"
              />
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-sm text-red-500 mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ➕ Add Education
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-medium"
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded font-medium hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
