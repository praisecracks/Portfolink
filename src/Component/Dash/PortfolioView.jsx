import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase';
import Profile from '../../assets/profile.png';

import {
  FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaTimes, FaTools,
  FaGraduationCap, FaProjectDiagram, FaEnvelope, FaExternalLinkAlt
} from 'react-icons/fa';

import {
  FiSun, FiMoon
} from 'react-icons/fi';

import {
  FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaJs, FaDocker,
  FaAws, FaGitAlt
} from 'react-icons/fa';

import {
  SiTailwindcss, SiMongodb, SiTypescript, SiDjango, SiFirebase, SiNextdotjs,
  SiRuby, SiGo, SiCoreldraw, SiGithub as SiGH, SiAdobephotoshop,
  SiC, SiCplusplus, SiRust, SiPhp, SiMysql, SiPostgresql
} from 'react-icons/si';

import { useToast } from '../UI/ToastContext';
import ProjectCard from './ProjectCard';
import ProjectLightbox from './ProjectLightbox';
import { motion } from 'framer-motion';

const skillIcons = {
  JavaScript: <FaJs className="text-yellow-400" />,
  React: <FaReact className="text-sky-500" />,
  'Node.js': <FaNodeJs className="text-green-600" />,
  Python: <FaPython className="text-yellow-500" />,
  Django: <SiDjango className="text-green-800" />,
  CSS: <FaCss3Alt className="text-blue-600" />,
  HTML: <FaHtml5 className="text-orange-600" />,
  TypeScript: <SiTypescript className="text-blue-500" />,
  MongoDB: <SiMongodb className="text-green-700" />,
  Firebase: <SiFirebase className="text-yellow-500" />,
  Docker: <FaDocker className="text-blue-400" />,
  AWS: <FaAws className="text-orange-400" />,
  Git: <FaGitAlt className="text-red-500" />,
  Tailwind: <SiTailwindcss className="text-cyan-400" />,
  'Next.js': <SiNextdotjs className="text-black dark:text-white" />,
  Ruby: <SiRuby className="text-red-500" />,
  Go: <SiGo className="text-cyan-700" />,
  CorelDRAW: <SiCoreldraw className="text-green-700" />,
  GitHub: <SiGH className="text-gray-800 dark:text-white" />,
  Photoshop: <SiAdobephotoshop className="text-blue-900" />,
  C: <SiC className="text-blue-700" />,
  'C++': <SiCplusplus className="text-blue-500" />,
  Rust: <SiRust className="text-orange-800" />,
  PHP: <SiPhp className="text-indigo-700" />,
  MySQL: <SiMysql className="text-orange-500" />,
  SQL: <SiPostgresql className="text-blue-700" />
};

function PortfolioView() {
  const { uid } = useParams();
  const contentRef = useRef();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [navOpen, setNavOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Fetch user profile and portfolio projects
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        if (!uid) {
          console.error("UID not found in URL params.");
          setProfile(null);
          setProjects([]);
          setLoading(false);
          return;
        }

        const profileDocRef = doc(db, 'users', uid);
        const profileSnap = await getDoc(profileDocRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;

        const projectsQuery = query(collection(db, 'portfolio'), where('userId', '==', uid));
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setProfile(profileData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setProfile(null);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [uid]);

  // Derived tag list
  const allTags = React.useMemo(() => {
    const tags = new Set();
    projects.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [projects]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  };

  const filteredProjects = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter(p => {
      if (selectedTags.size > 0) {
        const has = (p.tags || []).some(t => selectedTags.has(t));
        if (!has) return false;
      }
      if (!q) return true;
      return (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || (p.tags || []).join(' ').toLowerCase().includes(q);
    });
  }, [projects, search, selectedTags]);

  // Handle contact form input changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, `messages/${uid}/inbox`), {
        ...contactForm,
        timestamp: new Date().toISOString(),
      });
      toast.push('Message sent successfully!', { type: 'info' });
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.push('Failed to send message!', { type: 'error' });
    }
  };

  // Debug log
  console.log("UID from params:", uid);

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading portfolio...</p>
      </div>
    );
  }

  // Handle missing profile
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-red-500 dark:text-red-400 mb-2">Portfolio Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">This portfolio is either private or doesn't exist.</p>
          <Link to="/" className="text-indigo-600 hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* HEADER */}
<header className="z-50 fixed top-0 w-full bg-indigo-700 dark:bg-indigo-900 shadow-md px-4 py-3 flex justify-between items-center">
  {/* Logo/Brand */}
  <div className="flex items-center gap-2 md:pl-40">
    <div className="bg-white text-indigo-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl">
      {profile?.fullName?.charAt(0) || 'U'}
    </div>
    <span className="text-white text-lg font-semibold tracking-wide">
      {profile?.fullName?.split(' ')[0]} {profile?.fullName?.split(' ')[1]?.charAt(0) || ''}
    </span>
  </div>

  {/* Mobile Hamburger */}
  <button
    onClick={() => setNavOpen(!navOpen)}
    className="sm:hidden text-white text-2xl"
    aria-label="Toggle navigation"
  >
    {navOpen ? <FaTimes /> : (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>

  {/* Navigation links */}
  <nav className={`absolute sm:static top-full left-0 w-full sm:w-auto bg-indigo-700 sm:bg-transparent transition-all duration-300 sm:flex sm:items-center sm:gap-6 ${navOpen ? 'block' : 'hidden'} sm:block`}>
    <a href="#home" className="block px-4 py-2 sm:px-0 sm:py-0 text-white hover:underline font-medium">Home</a>
    <a href="#skills" className="block px-4 py-2 sm:px-0 sm:py-0 text-white hover:underline font-medium">Skills</a>
    <a href="#projects" className="block px-4 py-2 sm:px-0 sm:py-0 text-white hover:underline font-medium">Projects</a>
    <a href="#education" className="block px-4 py-2 sm:px-0 sm:py-0 text-white hover:underline font-medium">Education</a>
    <a href="#contact-form-section" className="block px-4 py-2 sm:px-0 sm:py-0 text-white hover:underline font-medium">Contact</a>
  </nav>

  {/* Dark Mode Toggle */}
  <div className="hidden sm:flex items-center gap-2">
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-yellow-300 dark:bg-gray-700 text-yellow-800 dark:text-white hover:scale-110 transition shadow"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <FiSun /> : <FiMoon />}
    </button>
  </div>
</header>


      {/* MAIN CONTENT */}
      <main className="pt-24 px-4 pb-16 max-w-5xl mx-auto" ref={contentRef}>
        {/* HERO SECTION */}
        <section id="home" className="text-center flex flex-col items-center gap-4">
          <img
            src={profile.photoURL?.trim() || Profile}
            onError={(e) => { e.target.onerror = null; e.target.src = Profile; }}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 object-cover bg-gray-200 dark:bg-gray-700 shadow"
          />
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400">{profile.fullName}</h1>
          <p className="text-lg text-gray-800 dark:text-gray-300 font-medium">{profile.title}</p>
          <p className="text-center text-base text-gray-700 dark:text-gray-300 whitespace-pre-line max-w-xl">{profile.bio}</p>

          <div className="flex justify-center space-x-4 mt-2 text-xl">
            {profile.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-indigo-400"><FaGithub /></a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-400"><FaLinkedin /></a>
            )}
            {profile.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-indigo-400"><FaTwitter /></a>
            )}
            {profile.socialLinks?.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-indigo-400"><FaInstagram /></a>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <a href="#projects" className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition">View Projects</a>
            <a href="#contact-form-section" className="border border-indigo-600 text-indigo-700 px-5 py-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-700 transition">Contact</a>
          </div>

          <div className="mt-8 animate-bounce text-indigo-400">
            <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M12 5v14m7-7-7 7-7-7" /></svg>
          </div>
        </section>
        {/* SKILLS SECTION */}
        <section id="skills" className="my-20 text-center scroll-mt-24">
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">Skills</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Here are the tools and technologies I work with to bring ideas to life.
          </p>
          {profile.skills?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
              {profile.skills.map(skill => (
                <div key={skill} className="bg-white dark:bg-indigo-900 rounded-lg shadow p-4 flex flex-col items-center hover:scale-105 transition">
                  <span className="text-3xl mb-2">
                    {skillIcons[skill] || <FaTools />}
                  </span>
                  <span className="font-semibold text-indigo-800 dark:text-white">{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500">No skills listed.</p>
          )}
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="my-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 text-center">Projects</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Some of my recent work showcasing problem-solving and creativity.
          </p>

          <div className="max-w-2xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Search projects..." className="px-3 py-2 rounded-md border focus:ring-2 focus:ring-indigo-500" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {allTags.map((t) => (
                <button key={t} onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full text-sm ${selectedTags.has(t) ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500">No projects found.</p>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onOpen={(p) => setSelectedProject(p)} />
              ))}
            </motion.div>
          )}
        </section>

        {/* MODAL FOR SELECTED PROJECT */}
        {selectedProject && (
          <ProjectLightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}

        {/* EDUCATION SECTION */}
        <section id="education" className="my-20 scroll-mt-24">
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 text-center">Education</h2>
          {profile.education?.length ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {profile.education.map((edu, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{edu.degree}</h3>
                  <p className="text-indigo-600 dark:text-indigo-300">{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.years}</p>
                  {edu.note && <p className="text-gray-600 mt-1 italic whitespace-pre-line">{edu.note}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-500">No education details provided.</p>
          )}
        </section>

        {/* CONTACT SECTION */}
        <section id="contact-form-section" className="my-20 scroll-mt-24 max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-4">Contact Me</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={contactForm.name}
              onChange={handleContactChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={contactForm.email}
              onChange={handleContactChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Your message"
              value={contactForm.message}
              onChange={handleContactChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition font-semibold"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-xs text-gray-400 dark:text-gray-500 mt-12">
          &copy; {new Date().getFullYear()} {profile.fullName} — Built with ❤️ using Portfolink
        </footer>
      </main>
    </div>
  );
}

export default PortfolioView;
