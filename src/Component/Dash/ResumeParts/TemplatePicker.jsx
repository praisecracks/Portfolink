import React from 'react';

const templateOptions = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'elegant', name: 'Elegant' },
];

function TemplatePicker({ selectedTemplate, onChange }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Choose Resume Template</h2>
      <div className="flex gap-3 flex-wrap">
        {templateOptions.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={`px-4 py-2 border rounded-md font-semibold transition ${
              selectedTemplate === template.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplatePicker;
