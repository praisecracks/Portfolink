import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../../firebase';
import {
  doc, getDoc, collection, query, where, onSnapshot, updateDoc,
} from 'firebase/firestore';
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import Chat from './Chat';
import ResumeHeader from './ResumeParts/ResuneHeader';
import ResumeSocialLinks from './ResumeParts/ResumeSocialLinks';
import ResumeSkills from './ResumeParts/ResumeSkills';
import ResumeSection from './ResumeParts/ResumeSection';
import ResumeProjects from './ResumeParts/ResumeProjects';
import ResumeFooter from './ResumeParts/ResumeFooter';
import TemplatePicker from './ResumeParts/TemplatePicker';
import generateDocx from './ResumeParts/generateDocx';
import BoopLoader from './All Port/BoopLoader';
import templateStyles from './ResumeParts/templateStyles';

function ResumeGenerator() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const resumeRef = useRef();

  const templateClasses = {
    modern: 'bg-white shadow-lg p-6 md:p-10 rounded-lg text-gray-800 font-sans',
    classic: 'bg-white p-8 rounded-md text-gray-900 font-serif border-l-4 border-gray-600',
    elegant: 'bg-gray-50 p-10 rounded-lg text-indigo-800 italic font-serif border-l-4 border-indigo-400',
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) setLoading(false);
    });
    return unsubscribe;
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

  const handleDownloadDOCX = async () => {
    if (!profile) return;
    const blob = await generateDocx(profile, projects);
    saveAs(blob, 'My_Resume.docx');
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

  if (loading) return <p className="text-center p-10"> <BoopLoader /> </p>;
  if (!user) return <p className="text-center p-10 text-red-500">⚠️ Please log in.</p>;
  if (!profile) return <p className="text-center p-10 text-red-500">⚠️ No profile data.</p>;

  const activeTemplateStyles = templateStyles[selectedTemplate] || {};

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
          Export PDF
        </button>
        <button onClick={handleDownloadDOCX} className="px-4 py-2 bg-yellow-500 text-white rounded">
          Export DOCX
        </button>
      </div>

      <TemplatePicker selectedTemplate={selectedTemplate} onChange={setSelectedTemplate} />

      <div ref={resumeRef} className={`${templateClasses[selectedTemplate]} leading-relaxed`}>
        <ResumeHeader
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
          selectedTemplate={selectedTemplate}
        />
        <ResumeSocialLinks
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
        />
        <ResumeSkills
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
        />
        <ResumeSection
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
          section="education"
          title="Education"
          template={{ degree: '', school: '', years: '' }}
          selectedTemplate={selectedTemplate}
        />
        <ResumeSection
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
          section="experience"
          title="Experience"
          template={{ role: '', company: '', years: '', description: '' }}
          selectedTemplate={selectedTemplate}
        />
        <ResumeSection
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
          section="certifications"
          title="Certifications"
          template={{ title: '', issuer: '', date: '' }}
          selectedTemplate={selectedTemplate}
        />
        <ResumeSection
          profile={profile}
          editMode={editMode}
          setProfile={setProfile}
          section="languages"
          title="Languages"
          selectedTemplate={selectedTemplate}
        />
        <ResumeProjects projects={projects} />
        <ResumeFooter />
      </div>

      <Chat />
    </div>
  );
}

export default ResumeGenerator;
