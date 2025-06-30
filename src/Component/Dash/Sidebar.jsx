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
import {
  collection,
  getDoc,
  onSnapshot,
  query
} from 'firebase/firestore';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = auth.currentUser;

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messageCount, setMessageCount] = useState(0);
  const lastMessageRef = useRef(null);

  // 🔔 Request permission for browser notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ✅ Listen for new messages and trigger alert
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, `messages/${currentUser.uid}/inbox`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const unread = msgs.filter(msg => !msg.readAt);
      setMessageCount(unread.length);

      // 🔔 Detect new message
      const latestMsg = msgs[msgs.length - 1];
      if (
        latestMsg &&
        latestMsg.message !== lastMessageRef.current?.message
      ) {
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
    const audio = new Audio("/notification.mp3"); // ✅ Make sure this file exists in public/
    audio.play().catch(err => console.log("Audio play failed:", err));
  };

  // 🔐 Set Admin Mode
  useEffect(() => {
    if (!currentUser) return;
    const adminUID = 'msLzg2LxX7Rd3WKVwaqmhWl9KUk2';
    setIsAdmin(currentUser.uid === adminUID);
  }, [currentUser]);

  // 🎨 Theme
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

  const linkBaseClasses =
    "flex items-center py-2.5 px-4 rounded transition-colors duration-200 cursor-pointer select-none";

  const linkInactiveClasses = "text-gray-700 hover:bg-indigo-100 dark:text-gray-300 dark:hover:bg-indigo-700";

  const linkActiveClasses = "bg-indigo-100 font-semibold text-indigo-800 dark:bg-indigo-700 dark:text-white";

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-white shadow-md w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50 dark:bg-gray-900`}
        aria-label="Sidebar navigation"
      >
        <div className="flex justify-between items-center px-4">
          <img src={logo} alt="logo" className='w-5 h-5' />
          <h2 className="text-2xl font-bold text-indigo-600 flex-grow text-center dark:text-indigo-400">
            Portfolink
          </h2>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar">
              <FaTimes size={20} className="text-gray-600 dark:text-white" />
            </button>
          )}
        </div>

        <nav className="mt-10 flex flex-col gap-1">
          <Link to="/dashboard" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaHome className="inline-block mr-2 w-5 h-5" /> Home
          </Link>
          <Link to="/dashboard/profile" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/profile") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaUser className="inline-block mr-2 w-5 h-5" /> Profile
          </Link>
          <Link to="/dashboard/portfolio" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/portfolio") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaIdBadge className="inline-block mr-2 w-5 h-5" /> Portfolio
          </Link>
          <Link to="/dashboard/projects" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/projects") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaProjectDiagram className="inline-block mr-2 w-5 h-5" /> Projects
          </Link>

          <Link to="/dashboard/messages" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/messages") ? linkActiveClasses : linkInactiveClasses}`}>
            <span className="flex items-center w-full justify-between">
              <span className="flex items-center">
                <FaEnvelope className="mr-2 w-5 h-5" />
                Messages
              </span>
              {messageCount > 0 && (
                <span className="bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
                  {messageCount}
                </span>
              )}
            </span>
          </Link>

          {currentUser && isAdmin && (
            <Link to="/dashboard/post" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/post") ? linkActiveClasses : linkInactiveClasses}`}>
              <FaEdit className="inline-block mr-2 w-5 h-5" />
              Add Post
            </Link>
          )}

          <Link to="/dashboard/about" onClick={handleLinkClick} className={`${linkBaseClasses} ${isActive("/dashboard/about") ? linkActiveClasses : linkInactiveClasses}`}>
            <FaInfoCircle className="inline-block mr-2 w-5 h-5" />
            About Web
          </Link>

          <button onClick={handleLogout} className="flex items-center w-full text-left py-2.5 px-4 rounded transition-colors duration-200 hover:bg-red-100 text-red-600 dark:text-red-400 dark:hover:bg-red-700">
            <FaSignOutAlt className="inline-block mr-2 w-5 h-5" />
            Logout
          </button>
        </nav>

        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {isDarkMode ? <><FaSun size={22} /> <span className="hidden md:inline text-sm">Light Mode</span></> :
              <><FaMoon size={22} /> <span className="hidden md:inline text-sm">Dark Mode</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
