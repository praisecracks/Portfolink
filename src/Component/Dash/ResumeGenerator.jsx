import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../../firebase';
import {
  doc, getDoc, collection, query, where, onSnapshot, updateDoc
} from 'firebase/firestore';
import Profile from '../../assets/profile.png';
import html2pdf from 'html2pdf.js';

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

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }

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

  const saveProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, profile);
      alert('Profile updated successfully.');
      setEditMode(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (loading) return <p className="text-center p-10">Loading Resume...</p>;
  if (!user) return <p className="text-center p-10 text-red-500">⚠️ Please log in.</p>;
  if (!profile) return <p className="text-center p-10 text-red-500">⚠️ No profile data.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-right mb-6 space-x-3">
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
        >
          {editMode ? 'Cancel' : 'Edit Resume'}
        </button>
        {editMode && (
          <button
            onClick={saveProfile}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        )}
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download as PDF
        </button>
      </div>

      <div ref={resumeRef} className="bg-white shadow-md rounded-lg p-6">
        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={profile.photoURL?.trim() || Profile}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-600"
          />
          {editMode ? (
            <>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                className="mt-4 text-xl font-bold text-center border-b focus:outline-none"
              />
              <input
                type="text"
                value={profile.title}
                onChange={(e) => handleProfileChange('title', e.target.value)}
                className="text-indigo-600 text-sm text-center mt-1 border-b focus:outline-none"
              />
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="text-gray-600 text-sm text-center mt-2 border rounded p-2 w-full"
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mt-4">{profile.fullName}</h1>
              <p className="text-indigo-600">{profile.title}</p>
              <p className="text-gray-600 mt-2 max-w-lg text-center">{profile.bio}</p>
            </>
          )}
        </div>

        {/* Social Links */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">Social Links</h2>
          <div className="space-y-2">
            {['github', 'linkedin', 'twitter'].map((platform) => (
              <div key={platform} className="text-sm">
                {editMode ? (
                  <input
                    type="text"
                    value={profile.socialLinks?.[platform] || ''}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, [platform]: e.target.value },
                      }))
                    }
                    placeholder={`Enter ${platform} URL`}
                    className="w-full border rounded p-1"
                  />
                ) : (
                  profile.socialLinks?.[platform] && (
                    <p>
                      <strong>{platform.toUpperCase()}:</strong>{' '}
                      <span className="text-indigo-600">{profile.socialLinks[platform]}</span>
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">Skills</h2>
          {editMode ? (
            <textarea
              value={profile.skills?.join(', ') || ''}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))
              }
              className="w-full border rounded p-2 text-sm"
              placeholder="Comma-separated skills"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">Education</h2>
          {profile.education?.length > 0 ? (
            profile.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-sm">{edu.school} ({edu.years})</p>
                {edu.note && <p className="text-xs italic text-gray-600">{edu.note}</p>}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No education history listed.</p>
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">Projects</h2>
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div key={proj.id} className="mb-4 border-b pb-3">
                <h3 className="font-semibold">{proj.title}</h3>
                <p className="text-sm text-gray-700">{proj.description}</p>
                {proj.github && (
                  <p className="text-sm">
                    <strong>GitHub:</strong>{' '}
                    <span className="text-indigo-600">{proj.github}</span>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No projects found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResumeGenerator;
