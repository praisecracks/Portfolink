import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../../firebase';
import {
  doc, getDoc, collection, query, where, onSnapshot, updateDoc,
} from 'firebase/firestore';
import Profile from '../../assets/profile.png';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';

function ResumeGenerator() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const resumeRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(docSnap.data());

        const q = query(collection(db, 'portfolio'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(data);
        });

        setLoading(false);
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDownloadPDF = () => {
    if (resumeRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: 'My_Resume.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(resumeRef.current)
        .save();
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...(profile[section] || [])];
    updated[index][field] = value;
    setProfile((prev) => ({ ...prev, [section]: updated }));
  };

  const addItemToSection = (section, template) => {
    const current = profile[section] || [];
    setProfile((prev) => ({ ...prev, [section]: [...current, template] }));
  };

  const deleteItemFromSection = (section, index) => {
    const filtered = [...(profile[section] || [])].filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, [section]: filtered }));
  };

  const saveProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, profile);
      toast.success('Resume updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading) return <p className="text-center p-10">Loading Resume...</p>;
  if (!user) return <p className="text-center p-10 text-red-500">⚠️ Please log in.</p>;
  if (!profile) return <p className="text-center p-10 text-red-500">⚠️ No profile data.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-right mb-6 space-x-3">
        <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded">
          {editMode ? 'Cancel' : 'Edit Resume'}
        </button>
        {editMode && (
          <button onClick={saveProfile} className="px-4 py-2 bg-indigo-600 text-white rounded">
            Save Changes
          </button>
        )}
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-600 text-white rounded">
          Download PDF
        </button>
      </div>

      <div ref={resumeRef} className="bg-white shadow-lg p-6 md:p-10 rounded-lg text-gray-800 leading-relaxed">
  {/* Profile */}
  <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 text-center md:text-left mb-8">
    <img
      src={profile.photoURL?.trim() || Profile}
      alt="Profile"
      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-indigo-600"
    />
    <div className="mt-4 md:mt-0">
      {editMode ? (
        <>
          <input
            placeholder="Full Name"
            value={profile.fullName}
            onChange={(e) => handleProfileChange('fullName', e.target.value)}
            className="block w-full text-xl font-bold border-b mb-1"
          />
          <input
            placeholder="Job Title"
            value={profile.title}
            onChange={(e) => handleProfileChange('title', e.target.value)}
            className="block w-full text-indigo-600 text-sm border-b mb-2"
          />
          <textarea
            placeholder="Short bio..."
            value={profile.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            className="text-gray-700 text-sm border rounded p-2 w-full"
          />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-indigo-600 font-medium">{profile.title}</p>
          <p className="text-sm text-gray-600 mt-2 max-w-xl">{profile.bio}</p>
        </>
      )}
    </div>
  </div>

  {/* Social Links */}
  <section className="mb-6">
    <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Social Links</h2>
    {['github', 'linkedin', 'twitter'].map((platform) => (
      <div key={platform} className="text-sm mb-1">
        {editMode ? (
          <input
            placeholder={`${platform} URL`}
            type="text"
            value={profile.socialLinks?.[platform] || ''}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [platform]: e.target.value },
              }))
            }
            className="w-full border rounded p-1 mb-1"
          />
        ) : (
          profile.socialLinks?.[platform] && (
            <p>
              <span className="font-semibold">{platform.toUpperCase()}:</span>{' '}
              <a href={profile.socialLinks[platform]} className="text-indigo-600 underline" target="_blank" rel="noreferrer">
                {profile.socialLinks[platform]}
              </a>
            </p>
          )
        )}
      </div>
    ))}
  </section>

  {/* Skills */}
  <section className="mb-6">
    <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Skills</h2>
    {editMode ? (
      <textarea
        placeholder="e.g. React, Firebase, Tailwind"
        value={profile.skills?.join(', ') || ''}
        onChange={(e) => handleProfileChange('skills', e.target.value.split(',').map((s) => s.trim()))}
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

  {/* Dynamic Section Builder */}
  {[
    { title: 'Education', field: 'education', template: { degree: '', school: '', years: '' } },
    { title: 'Experience', field: 'experience', template: { role: '', company: '', description: '' } },
    { title: 'Certifications', field: 'certifications', template: { title: '', issuer: '', date: '' } },
  ].map(({ title, field, template }) => (
    <section className="mb-6" key={field}>
      <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">{title}</h2>
      {(profile[field] || []).map((item, i) => (
        <div key={i} className="mb-3">
          {editMode ? (
            <>
              {Object.keys(template).map((key) => (
                <input
                  key={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={item[key]}
                  onChange={(e) => handleArrayChange(field, i, key, e.target.value)}
                  className="w-full border mb-1 p-1"
                />
              ))}
              <button onClick={() => deleteItemFromSection(field, i)} className="text-red-500 text-sm mb-2">
                ❌ Remove
              </button>
            </>
          ) : (
            <div className="text-sm leading-snug">
              <p className="font-semibold text-base">
                {item.degree || item.title || item.role}
              </p>
              <p className="text-gray-600">
                {item.school || item.issuer || item.company}{' '}
                {item.years || item.date ? `(${item.years || item.date})` : ''}
              </p>
              {item.description && <p className="text-xs mt-1">{item.description}</p>}
            </div>
          )}
        </div>
      ))}
      {editMode && (
        <button onClick={() => addItemToSection(field, template)} className="text-sm text-indigo-600 mt-2">
          + Add {title}
        </button>
      )}
    </section>
  ))}

  {/* Languages */}
  <section className="mb-6">
    <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Languages</h2>
    {editMode ? (
      <textarea
        placeholder="e.g. English, Spanish"
        value={profile.languages?.join(', ') || ''}
        onChange={(e) => handleProfileChange('languages', e.target.value.split(',').map((l) => l.trim()))}
        className="w-full border p-2 text-sm"
      />
    ) : (
      <p className="text-sm">{profile.languages?.join(', ') || 'No languages listed.'}</p>
    )}
  </section>

  {/* Projects */}
  <section className="mb-2">
    <h2 className="text-lg font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Projects</h2>
    {projects.map((proj) => (
      <div key={proj.id} className="mb-3">
        <p className="font-semibold">{proj.title}</p>
        <p className="text-sm text-gray-600">{proj.description}</p>
        {proj.github && (
          <a href={proj.github} className="text-sm text-indigo-600 underline" target="_blank" rel="noreferrer">
            GitHub: {proj.github}
          </a>
        )}
      </div>
    ))}
  </section>
  <div className='text-center text-gray-300 text-xs mt-6'>
    <p>genrated with <i>portfolink</i> </p>
  </div>
</div>
    </div>
  );
}

export default ResumeGenerator;
