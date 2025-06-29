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
  FaTimes,
} from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

function PortfolioView() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const contentRef = useRef();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading portfolio...</p>
      </div>
    );
  }

  if (!profile) return <p className="text-center mt-10 dark:text-white">Portfolio not found.</p>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} px-4 py-8 max-w-5xl mx-auto relative transition-all`}>
      
      {/* Action buttons */}
      <div className="flex gap-4 justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button onClick={downloadPDF} className="flex items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"><FaDownload /> PDF</button>
        <button onClick={downloadAsImage} className="flex items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"><FaDownload /> Image</button>
        <button onClick={printPortfolio} className="flex items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"><FaPrint /> Print</button>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-md relative">
        <div className="absolute bottom-2 right-4 text-xs text-gray-300 dark:text-gray-500 opacity-70 pointer-events-none">Portfolink</div>

        {/* Profile */}
        <section className="flex flex-col items-center gap-4 mb-6">
          <img
            src={profile.photoURL?.trim() || Profile}
            onError={(e) => { e.target.onerror = null; e.target.src = Profile; }}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 object-cover bg-gray-300"
          />
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{profile.fullName}</h1>
          <p className="text-md text-gray-900 dark:text-white font-bold">{profile.title}</p>
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{profile.bio}</p>
          <div className="flex justify-center space-x-6 text-indigo-600 text-lg mt-4">
            {profile.socialLinks?.github && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.github} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {profile.socialLinks?.linkedin && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>}
            {profile.socialLinks?.twitter && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.length ? profile.skills.map(skill => (
              <span key={skill} className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white px-3 py-1 rounded-full text-sm">{skill}</span>
            )) : <p className="text-gray-400 dark:text-gray-500">No skills listed</p>}
          </div>
        </section>

        {/* Education */}
        <section className="mb-6 mt-20">
          <h1 className="text-center font-semibold text-indigo-700 dark:text-indigo-400 mb-2 text-2xl mt-10">Education</h1>
          {profile.education?.length ? profile.education.map(({ school, degree, years, note }, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow-sm mb-2">
              <h3 className="text-lg font-bold">{degree}</h3>
              <p className="text-indigo-700 dark:text-indigo-300">{school}</p>
              <p className="text-sm text-gray-500 text-end dark:text-gray-300">{years}</p>
              {note && <p className="italic mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{note}</p>}
            </div>
          )) : <p className="text-gray-400 dark:text-gray-500">No education listed</p>}
        </section>

        {/* Projects */}
        <section>
          <h1 className="text-center font-semibold text-indigo-700 dark:text-indigo-400 mb-2 text-2xl mt-10">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">These are my recent projects that showcase my work.</p>
          {projects.length ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer bg-white dark:bg-gray-700 shadow p-3 rounded-md hover:shadow-lg transition"
                >
                  {project.imageURL && (
                    <img src={project.imageURL} alt={project.title} className="mb-2 h-32 w-full object-cover rounded" />
                  )}
                  <h3 className="text-md font-bold text-indigo-700 dark:text-indigo-300">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{project.description?.slice(0, 80)}...</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 dark:text-gray-500">No projects available</p>}
        </section>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <Link
          to="/register"
          className="px-5 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
        >
          Sign Up to Create Your Own Portfolio
        </Link>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 max-w-xl w-full p-6 rounded-lg relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedProject(null)} className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl">
              <FaTimes />
            </button>
            {selectedProject.imageURL && (
              <img src={selectedProject.imageURL} alt="Project" className="rounded mb-4 w-full object-cover h-52" />
            )}
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">{selectedProject.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line mb-3">{selectedProject.description}</p>

            {selectedProject.github && (
              <p className="mb-2">
                <span className="font-semibold">GitHub:</span>{' '}
                <a href={selectedProject.github} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-300 underline">
                  View Repo <FaGithub className="inline ml-1" />
                </a>
              </p>
            )}

            {selectedProject.liveURL && (
              <p className="mb-2">
                <span className="font-semibold">Live Demo:</span>{' '}
                <a href={selectedProject.liveURL} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-300 underline">
                  Visit Site <FaExternalLinkAlt className="inline ml-1" />
                </a>
              </p>
            )}

            {selectedProject.duration && (
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                <strong>Duration:</strong> {selectedProject.duration}
              </p>
            )}

            {selectedProject.tools && selectedProject.tools.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tools Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tools.map((tool, idx) => (
                    <span key={idx} className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white px-2 py-1 rounded-full text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioView;
