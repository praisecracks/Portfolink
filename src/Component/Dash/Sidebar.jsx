import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assets/portLogo.png";
import {
  FaHome, FaUser, FaSignOutAlt, FaProjectDiagram, FaIdBadge, FaMoon,
  FaSun, FaTimes, FaEdit, FaInfoCircle, FaEnvelope
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import { collection, onSnapshot, query } from 'firebase/firestore';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = auth.currentUser;

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messageCount, setMessageCount] = useState(0);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, `messages/${currentUser.uid}/inbox`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const unread = msgs.filter(msg => !msg.readAt);
      setMessageCount(unread.length);

      const latestMsg = msgs[msgs.length - 1];
      if (latestMsg && latestMsg.message !== lastMessageRef.current?.message) {
        notifyUser(latestMsg.name, latestMsg.message);
        playSound();
        lastMessageRef.current = latestMsg;
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const notifyUser = (name, message) => {
    if (Notification.permission === "granted") {
      new Notification(`📬 New message from ${name}`, {
        body: message.slice(0, 80) + '...',
        icon: logo,
      });
    }
  };

  const playSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(err => console.log("Audio play failed:", err));
  };

  useEffect(() => {
    if (!currentUser) return;
    const adminUID = 'msLzg2LxX7Rd3WKVwaqmhWl9KUk2';
    setIsAdmin(currentUser.uid === adminUID);
  }, [currentUser]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed!');
      console.error(error);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkBaseClasses = "flex items-center gap-2 py-2.5 px-4 rounded transition duration-200 select-none text-sm font-medium";
  const linkInactiveClasses = "text-gray-700 hover:bg-indigo-100 dark:text-gray-300 dark:hover:bg-indigo-700";
  const linkActiveClasses = "bg-indigo-100 text-indigo-900 font-semibold dark:bg-indigo-700 dark:text-white";

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-white dark:bg-gray-900 shadow-md w-64 py-4 px-2 overflow-y-auto max-h-screen fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 mb-4">
          <img src={logo} alt="logo" className='w-6 h-6' />
          <h2 className="text-xl font-bold text-indigo-600 text-center flex-1 dark:text-indigo-400">
            Portfolink
          </h2>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar">
              <FaTimes size={18} className="text-gray-600 dark:text-white" />
            </button>
          )}
        </div>

        {/* User Profile */}
        {currentUser && (
          <div className="flex flex-col items-center gap-1 px-4 py-3 text-center mb-3 border-b dark:border-gray-700">
            <img
              src={currentUser.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <h3 className="text-sm font-semibold dark:text-white text-gray-800">{currentUser.displayName || "User"}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <Link to="/dashboard" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaHome /> Home
          </Link>
          <Link to="/dashboard/profile" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/profile") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaUser /> Profile
          </Link>

          {/* Portfolio Dropdown */}
          <div>
            <button
              onClick={() => setPortfolioOpen(!portfolioOpen)}
              className={`${linkBaseClasses} ${location.pathname.startsWith("/dashboard/portfolio") ? linkActiveClasses : linkInactiveClasses} w-full flex justify-between items-center`}
            >
              <span className="flex items-center gap-2">
                <FaIdBadge />
                Portfolio
              </span>
              <span className="text-xs">{portfolioOpen ? '▲' : '▼'}</span>
            </button>

            {portfolioOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <Link
                  to="/dashboard/portfolio"
                  onClick={handleLinkClick}
                  className={`${linkBaseClasses} ${isActive("/dashboard/portfolio") ? linkActiveClasses : linkInactiveClasses}`}
                >
                  View/Edit
                </Link>
                <Link
                  to="/dashboard/portfolio/resume"
                  onClick={handleLinkClick}
                  className={`${linkBaseClasses} ${isActive("/dashboard/portfolio/resume") ? linkActiveClasses : linkInactiveClasses}`}
                >
                  Generate Resume
                </Link>
              </div>
            )}
          </div>

          <Link to="/dashboard/projects" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/projects") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaProjectDiagram /> Projects
          </Link>

          <Link to="/dashboard/messages" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/messages") ? linkActiveClasses : linkInactiveClasses}`}>
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <FaEnvelope /> Messages
              </span>
              {messageCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {messageCount}
                </span>
              )}
            </div>
          </Link>

          {currentUser && isAdmin && (
            <Link to="/dashboard/post" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/post") ? linkActiveClasses : linkInactiveClasses}`}>
              <FaEdit /> Add Post
            </Link>
          )}

          <Link to="/dashboard/about" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/about") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaInfoCircle /> About Web
          </Link>

          <button onClick={handleLogout} className="flex items-center w-full text-left text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 py-2.5 px-4 rounded">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </nav>

        <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300 flex items-center gap-2 text-sm">
            {isDarkMode ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
