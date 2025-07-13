import React from 'react';
import templateStyles from './templateStyles';

function ResumeSection({ profile, editMode, setProfile, section, title, template, selectedTemplate }) {
  const styles = templateStyles[selectedTemplate] || {};

  const handleArrayChange = (index, key, value) => {
    const updated = [...(profile[section] || [])];
    updated[index][key] = value;
    setProfile((prev) => ({ ...prev, [section]: updated }));
  };

  const addItemToSection = () => {
    const current = profile[section] || [];
    setProfile((prev) => ({ ...prev, [section]: [...current, template] }));
  };

  const deleteItemFromSection = (index) => {
    const filtered = [...(profile[section] || [])].filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, [section]: filtered }));
  };

  return (
    <section className={`mb-6 p-4 rounded ${styles.sectionBg}`}>
      <h2 className={`text-lg font-semibold mb-2 uppercase tracking-wide ${styles.sectionTitle}`}>
        {title}
      </h2>

      {(profile[section] || []).map((item, i) => (
        <div key={i} className="mb-3">
          {editMode && template ? (
            <>
              {Object.keys(template).map((key) => (
                <input
                  key={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={item[key]}
                  onChange={(e) => handleArrayChange(i, key, e.target.value)}
                  className="w-full border mb-1 p-1"
                />
              ))}
              <button
                onClick={() => deleteItemFromSection(i)}
                className="text-red-500 text-sm mb-2"
              >
                ❌ Remove
              </button>
            </>
          ) : (
            <div className="text-sm leading-snug">
              {typeof item === 'string' ? (
                <p>{item}</p>
              ) : (
                <>
                  <p className="font-semibold text-base">{item.degree || item.title || item.role}</p>
                  <p className="text-gray-600">
                    {item.school || item.issuer || item.company}{' '}
                    {item.years || item.date ? `(${item.years || item.date})` : ''}
                  </p>
                  {item.description && <p className="text-xs mt-1">{item.description}</p>}
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {editMode && template && (
        <button onClick={addItemToSection} className="text-sm text-indigo-600 mt-2">
          + Add {title}
        </button>
      )}
    </section>
  );
}

export default ResumeSection;
