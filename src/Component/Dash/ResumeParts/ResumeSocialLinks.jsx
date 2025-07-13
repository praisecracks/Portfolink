import React from 'react';

function ResumeSocialLinks({ profile, editMode, setProfile }) {
  const handleChange = (platform, value) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  return (
    <section className="mb-6 border-b pb-4">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Social Links</h2>
      {['github', 'linkedin', 'twitter'].map((platform) => (
        <div key={platform} className="text-sm mb-1">
          {editMode ? (
            <input
              placeholder={`${platform} URL`}
              type="text"
              value={profile.socialLinks?.[platform] || ''}
              onChange={(e) => handleChange(platform, e.target.value)}
              className="w-full border rounded p-1 mb-1"
            />
          ) : (
            profile.socialLinks?.[platform] && (
              <p>
                <span className="font-semibold">{platform.toUpperCase()}:</span>{' '}
                <a
                  href={profile.socialLinks[platform]}
                  className="text-indigo-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.socialLinks[platform]}
                </a>
              </p>
            )
          )}
        </div>
      ))}
    </section>
  );
}

export default ResumeSocialLinks;
