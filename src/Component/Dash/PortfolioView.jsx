import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Profile from '../../assets/profile.png';
import {
  FaExternalLinkAlt, FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaPrint,
  FaDownload, FaTimes, FaTools, FaGraduationCap, FaProjectDiagram, FaEnvelope, 
} from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { SiTailwindcss, SiMongodb, SiTypescript, SiDjango } from 'react-icons/si';
import SimpleIcon from 'react-simple-icons';
import { SiFirebase, SiNextdotjs,
} from 'react-icons/si';
import {FaDocker, FaAws, FaGitAlt // <-- Add these here
} from 'react-icons/fa';
import {SiRuby, SiGo,} from 'react-icons/si';
import {SiCoreldraw, SiGithub, SiAdobephotoshop,
} from 'react-icons/si';
import { SiC, SiCplusplus, SiRust, SiPhp, SiMysql, SiPostgresql
} from 'react-icons/si';



function PortfolioView() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const contentRef = useRef();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [navOpen, setNavOpen] = useState(false);

  // ...existing useEffect and handlers...
const skillIcons = {
  "JavaScript": <FaJs className="text-yellow-400" />,
  "React": <FaReact className="text-sky-500" />,
  "Node.js": <FaNodeJs className="text-green-600" />,
  "Python": <FaPython className="text-yellow-500" />,
  "Django": <SiDjango className="text-green-800" />,
  "CSS": <FaCss3Alt className="text-blue-600" />,
  "HTML": <FaHtml5 className="text-orange-600" />,
  "TypeScript": <SiTypescript className="text-blue-500" />,
  "MongoDB": <SiMongodb className="text-green-700" />,
  "Firebase": <SiFirebase className="text-yellow-500" />,
  "Docker": <FaDocker className="text-blue-400" />,
  "AWS": <FaAws className="text-orange-400" />,
  "Git": <FaGitAlt className="text-red-500" />,
  "Tailwind": <SiTailwindcss className="text-cyan-400" />,
  "Next.js": <SiNextdotjs className="text-black dark:text-white" />,
   "Ruby": <SiRuby className="text-red-500" />,
  "Go": <SiGo className="text-cyan-700" />,
   "CorelDRAW": <SiCoreldraw className="text-green-700" />,
  "GitHub": <SiGithub className="text-gray-800 dark:text-white" />,
  "Photoshop": <SiAdobephotoshop className="text-blue-900" />,
  "C": <SiC className="text-blue-700" />,
  "C++": <SiCplusplus className="text-blue-500" />,
  "Rust": <SiRust className="text-orange-800" />,
  "PHP": <SiPhp className="text-indigo-700" />,
  "MySQL": <SiMysql className="text-orange-500" />,
  "SQL": <SiPostgresql className="text-blue-700" />, 
};

  // Add these handlers to fix the error:
 const downloadPDF = () => {
  if (!contentRef.current) return;
  html2pdf()
    .set({
      margin: 0.5,
      filename: `${profile.fullName || "portfolio"}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    })
    .from(contentRef.current)
    .save();
};

const downloadAsImage = () => {
  if (!contentRef.current) return;
  toPng(contentRef.current, { cacheBust: true })
    .then((dataUrl) => {
      saveAs(dataUrl, `${profile.fullName || "portfolio"}.png`);
    })
    .catch((err) => {
      toast.error("Failed to export image");
      console.error(err);
    });
};

  const printPortfolio = () => {
    window.print();
  };

  // ...rest of your component...
  // Fetch profile and projects
  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      try {
        const profileDoc = await getDoc(doc(db, 'users', uid));
        setProfile(profileDoc.exists() ? profileDoc.data() : null);

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

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Contact form handlers
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `messages/${uid}/inbox`), {
        ...contactForm,
        timestamp: new Date().toLocaleString(),
      });
      toast.success('Message sent successfully!');
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Message sending failed:', err);
      toast.error('Failed to send message!');
    }
  };

  

  // Download/print handlers (same as your code)
  // ... (keep your downloadPDF, printPortfolio, downloadAsImage, downloadWord functions here)

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-10">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading portfolio...</p>
      </div>
    );
  }
  if (!profile) return <p className="text-center mt-10 dark:text-white">Portfolio not found.</p>;


  return (
    <div className={`z-{10} min-h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} px-0 py-8 relative transition-all `}>
      {/* Responsive Nav Header with Hamburger */}
      <header className="z-50 fixed top-0 w-full bg-indigo-700 dark:bg-indigo-900 shadow-lg px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo/Brand */}
        <div className="flex items-center justify-between w-full sm:w-auto">

          <button
            className="sm:hidden text-white text-2xl focus:outline-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            {navOpen ? <FaTimes /> : <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
        {/* Navigation Links */}
        <nav className={`flex-col sm:flex-row flex-wrap justify-left gap-4 flex ${navOpen ? 'flex' : 'hidden'} sm:flex w-full sm:w-auto`}>
          <a href="#home" className="text-white font-semibold hover:underline transition">Home</a>
          <a href="#skills" className="text-white font-semibold hover:underline transition">Skills</a>
          <a href="#projects" className="text-white font-semibold hover:underline transition">Projects</a>
          <a href="#education" className="text-white font-semibold hover:underline transition">Education</a>
          <a href="#contact-form-section" className="text-white font-semibold hover:underline transition">Contact</a>
        </nav>
        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center mt-2 sm:mt-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-yellow-300 dark:bg-gray-700 text-yellow-800 dark:text-white hover:scale-110 transition shadow"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          {/* <button
            onClick={downloadPDF}
            className="flex items-center gap-2 p-2 bg-white/20 hover:bg-white/30 rounded text-white text-xs sm:text-sm shadow"
            title="Download as PDF"
          >
            <FaDownload /> <span className="hidden sm:inline">PDF</span>
          </button> */}
          <button
            onClick={downloadAsImage}
            className="flex items-center gap-2 p-2 bg-white/20 hover:bg-white/30 rounded text-white text-xs sm:text-sm shadow"
            title="Download as Image"
          >
            <FaDownload /> <span className="hidden sm:inline">Image</span>
          </button>
          {/* <button
            onClick={printPortfolio}
            className="flex items-center gap-2 p-2 bg-white/20 hover:bg-white/30 rounded text-white text-xs sm:text-sm shadow"
            title="Print Portfolio"
          >
            <FaPrint /> <span className="hidden sm:inline">Print</span>
          </button> */}
        </div>
      </header>
      {/* ...rest of your content... */}

      {/* Main Content */}
      <div ref={contentRef} className="bg-white dark:bg-gray-800 shadow-md p-8 rounded-md relative  ">
        {/* Hero/Profile Section */}
        <section id='home' className=" flex flex-col items-center gap-4  pt-20">
          <img
            src={profile.photoURL?.trim() || Profile}
            onError={(e) => { e.target.onerror = null; e.target.src = Profile; }}
            alt="profile"
            className="w-32 h-32 rounded-full border-4 object-cover bg-gray-300 shadow-lg"
          />
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">{profile.fullName}</h1>
          <p className="text-lg text-gray-900 dark:text-white font-bold">{profile.title}</p>
          <p className="text-xl text-indigo-500 dark:text-indigo-300 font-semibold text-center">
            Building digital experiences, one project at a time.
          </p>
          <p className="text-center text-base text-gray-700 dark:text-gray-300 whitespace-pre-line max-w-2xl">{profile.bio}</p>
          <div className="flex justify-center space-x-6 text-indigo-600 text-2xl mt-2">
            {profile.socialLinks?.github && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.github} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {profile.socialLinks?.linkedin && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>}
            {profile.socialLinks?.twitter && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>}
            {profile.socialLinks?.instagram && <a className='p-2 border rounded bg-gray-200 dark:bg-gray-700' href={profile.socialLinks.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a>}

          </div>
          <div className="flex gap-4 mt-4">
        <a href="#projects" className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition">View Projects</a>
        <a href="#contact-form-section" className="bg-white text-indigo-700 border border-indigo-600 px-6 py-2 rounded shadow hover:bg-indigo-50 transition">Contact Me</a>
      </div>
      <div className="mt-8 animate-bounce text-indigo-400">
        <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M12 5v14m7-7-7 7-7-7"/></svg>
      </div>
        </section>

        {/* Divider */}
        {/* <div className="border-t border-indigo-200 dark:border-indigo-700 my-8"></div> */}

        {/* Skills Section */}
        <section
  id="skills"
  className="mb-10 min-h-[60vh] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 rounded-xl shadow-lg p-8 mb-10 min-h-[60vh] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 rounded-xl shadow-lg p-8 scroll-mt-24"
>
  <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
    Skills
  </h2>
  <p className="mb-8 text-center text-gray-600 dark:text-gray-300 max-w-xl">
    Here are some of the technologies and tools I use to build amazing products and solve real-world problems.
  </p>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
  {profile.skills?.length ? (
    profile.skills.map(skill => (
      <div
        key={skill}
        className="flex flex-col items-center bg-white dark:bg-indigo-900 rounded-lg shadow p-4 hover:scale-105 transition"
      >
        <span className="text-3xl mb-2">
          {skillIcons[skill] || <FaTools />}
        </span>
        <span className="font-semibold text-indigo-800 dark:text-white text-lg">{skill}</span>
      </div>
    ))
  ) : (
    <p className="text-gray-400 dark:text-gray-500 col-span-full text-center">No skills listed</p>
  )}
</div>
</section>



    {/* Projects Section */}
        <section id='projects' className="mb-10 mt-20 scroll-mt-40">
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2 center justify-center scroll-mt-24">
            <FaProjectDiagram className="inline" /> Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
            These are my recent projects that showcase my work.
          </p>
          {projects.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-center">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition p-4 cursor-pointer flex flex-col"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.imageURL ? (
                    <img
                      src={project.imageURL}
                      alt={project.title}
                      className="rounded-md object-cover h-40 w-full mb-3"
                    />
                  ) : (
                    <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md mb-3">
                      <FaProjectDiagram className="text-3xl text-gray-400" />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 flex-1">
                    {project.description?.slice(0, 80) || "No description"}
                  </p>

                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-blue-600 hover:underline text-xs"
                      onClick={e => e.stopPropagation()}
                    >
                      <FaGithub className="mr-1" /> GitHub
                    </a>
                  )}
                  {project.liveURL && (
                    <a
                      href={project.liveURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-green-600 hover:underline text-xs"
                      onClick={e => e.stopPropagation()}
                    >
                      <FaExternalLinkAlt className="mr-1" /> Live
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>



        {/* Divider */}
        <div className="border-t border-indigo-200 dark:border-indigo-700 my-8"></div>
                {/* Education Section */}
        <section id='education' className="mb-10 scroll-mt-40">
          <h2 className=" center justify-center text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2 text-center scroll-mt-24">
            <FaGraduationCap className="inline" /> Education
          </h2>
          <div className="space-y-4">
            {profile.education?.length ? (
              profile.education.map((edu, idx) => (
                <div key={idx} className="bg-indigo-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg text-gray-700 dark:text-white">{edu.degree || 'Degree'}</h3>
                    <div className="relative pl-6">
            <div className="absolute left-0 top-2 w-1 h-full bg-indigo-200 dark:bg-indigo-700 rounded"></div>
            {/* ...education cards here... */}
                  <p className="text-indigo-600 dark:text-indigo-300">{edu.school || 'School'}</p>
                  <p className="text-gray-500 text-sm">{edu.years || 'Years'}</p>
                  {edu.note && <p className="text-gray-600 mt-1 italic whitespace-pre-line">{edu.note}</p>}
                </div>
                  </div>
                
              ))
            ) : (
              <p className="text-gray-400 dark:text-gray-500">No education details added</p>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-indigo-200 dark:border-indigo-700 my-8"></div>


        {/* Divider */}
        <div className="border-t border-indigo-200 dark:border-indigo-700 my-8"></div>

        {/* Contact Section */}
        <section id="contact-form-section" className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl border border-indigo-100 dark:border-gray-700 mt-10 scroll-mt-40">
          <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
            <FaEnvelope className="inline mr-2" /> Contact Me
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Have a project in mind or want to connect? Send me a message and I'll get back to you soon!
          </p>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={contactForm.name}
                onChange={handleContactChange}
                className="w-full border border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-md px-4 py-2 shadow-sm transition bg-white dark:bg-gray-900"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={contactForm.email}
                onChange={handleContactChange}
                className="w-full border border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-md px-4 py-2 shadow-sm transition bg-white dark:bg-gray-900"
                placeholder="e.g. john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={contactForm.message}
                onChange={handleContactChange}
                className="w-full border border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-md px-4 py-2 shadow-sm transition resize-y bg-white dark:bg-gray-900"
                placeholder="Write your message here..."
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-200 shadow flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>✉️ Send Message</>
                )}
              </button>
            </div>
          </form>
        </section>
                {/* Project Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
            onClick={() => setSelectedProject(null)}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-2xl w-full relative shadow-md overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-900"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                {selectedProject.title}
              </h2>
              {selectedProject.imageURL && (
                <img
                  src={selectedProject.imageURL}
                  alt={selectedProject.title}
                  className="w-full h-60 object-cover rounded mb-4"
                />
              )}
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-4">
                {selectedProject.description || "No description provided."}
              </p>
              {selectedProject.category && (
                <p className="text-sm text-gray-500 mb-2">
                  <strong className="text-gray-700 dark:text-gray-300">Category:</strong> {selectedProject.category}
                </p>
              )}
              {selectedProject.tags?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject.github && (
                <div className="mt-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">GitHub:</span>{' '}
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 break-all hover:underline"
                  >
                    {selectedProject.github}
                  </a>
                </div>
              )}
              {selectedProject.liveURL && (
                <div className="mt-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Live:</span>{' '}
                  <a
                    href={selectedProject.liveURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 break-all hover:underline"
                  >
                    {selectedProject.liveURL}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-gray-400 dark:text-gray-600">
          &copy; {new Date().getFullYear()} {profile.fullName} &mdash; Powered by Portfolink
        </footer>
      </div>
    </div>
  );
}

export default PortfolioView;