import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Profile from '../../assets/profile.png';
import {
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaPrint,
  FaDownload,
} from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

function Viewport() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef();

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      try {
        const profileDoc = await getDoc(doc(db, 'users', uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        } else {
          setProfile(null);
        }

        const projectsQuery = query(collection(db, 'portfolio'), where('userId', '==', uid));
        const projectsSnapshot = await getDocs(projectsQuery);
        setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [uid]);

  const downloadPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `${profile?.fullName || 'portfolio'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(contentRef.current)
      .save();
  };

  const printPortfolio = () => {
    if (!contentRef.current) return;
    const original = document.body.innerHTML;
    const printContents = contentRef.current.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  const downloadAsImage = () => {
    if (!contentRef.current) return;
    toPng(contentRef.current)
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = `${profile?.fullName || 'portfolio'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(err => console.error('Image export error', err));
  };

  const downloadWord = async () => {
    if (!profile) return;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `Portfolio - ${profile.fullName}`, bold: true, size: 28 }),
              new TextRun("\n\n")
            ]
          }),
          new Paragraph(`Title: ${profile.title}`),
          new Paragraph(`Bio: ${profile.bio}`),
          new Paragraph(`Skills: ${profile.skills?.join(', ')}`),
        ]
      }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${profile.fullName || 'portfolio'}.docx`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading portfolio...</p>
      </div>
    );
  }

  if (!profile) return <p className="text-center mt-10">Portfolio not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 max-w-5xl mx-auto relative">
      {/* Action buttons */}
      <div className="flex gap-4 justify-end mb-4 text-indigo-700">
        <button onClick={downloadPDF} className="flex items-center gap-2 hover:underline"><FaDownload /> PDF</button>
        <button onClick={downloadAsImage} className="flex items-center gap-2 hover:underline"><FaDownload /> Image</button>
        {/* <button onClick={downloadWord} className="flex items-center gap-2 hover:underline"><FaDownload /> Word</button> */}
        <button onClick={printPortfolio} className="flex items-center gap-2 hover:underline"><FaPrint /> Print</button>
      </div>

      {/* Main Portfolio Content */}
      <div ref={contentRef} className="bg-white shadow-md p-6 rounded-md relative">
        <div className="absolute bottom-2 right-4 text-xs text-gray-300 opacity-70 pointer-events-none">Portfolink</div>

        {/* Profile */}
        <section className="flex flex-col items-center gap-4 mb-6">
          <img
            src={profile.photoURL?.trim() || Profile}
            onError={(e) => { e.target.onerror = null; e.target.src = Profile; }}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 object-cover bg-gray-300"
          />
          <h1 className="text-2xl font-bold text-indigo-700">{profile.fullName}</h1>
          <p className="text-md text-gray-600">{profile.title}</p>
          <p className="text-center text-sm text-gray-700 whitespace-pre-line">{profile.bio}</p>
          <div className="flex justify-center space-x-6 text-indigo-600 text-lg mt-4">
            {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>}
            {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.length ? profile.skills.map(skill => (
              <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">{skill}</span>
            )) : <p className="text-gray-400">No skills listed</p>}
          </div>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Education</h2>
          {profile.education?.length ? profile.education.map(({ school, degree, years, note }, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded shadow-sm mb-2">
              <h3 className="text-lg font-bold">{degree}</h3>
              <p className="text-indigo-700">{school}</p>
              <p className="text-sm text-gray-500">{years}</p>
              {note && <p className="italic mt-1 text-sm text-gray-600 whitespace-pre-line">{note}</p>}
            </div>
          )) : <p className="text-gray-400">No education listed</p>}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Projects</h2>
          {projects.length ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map(project => (
                <div key={project.id} className="bg-white shadow p-3 rounded-md">
                  {project.imageURL && (
                    <img src={project.imageURL} alt={project.title} className="mb-2 h-32 w-full object-cover rounded" />
                  )}
                  <h3 className="text-md font-bold text-indigo-700">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{project.description?.slice(0, 80)}...</p>
                  {project.liveURL && (
                    <a href={project.liveURL} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline">
                      Live Demo <FaExternalLinkAlt className="inline ml-1" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400">No projects available</p>}
        </section>
      </div>

      <div className="text-center mt-10">
        <Link
          to="/register"
          className="px-5 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Sign Up to Create Your Own Portfolio
        </Link>
      </div>
    </div>
  );
}

export default Viewport;
