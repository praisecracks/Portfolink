import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assets/portLogo.png";
import {
  FaHome, FaUser, FaSignOutAlt, FaProjectDiagram, FaIdBadge,
  FaMoon, FaSun, FaTimes, FaEdit, FaInfoCircle, FaEnvelope, FaShoppingCart, FaTools
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useToast } from '../UI/ToastContext';
import { collection, getDoc, doc, onSnapshot, query } from 'firebase/firestore';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = auth.currentUser;
  const toast = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messageCount, setMessageCount] = useState(0);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const lastMessageRef = useRef(null);
  const [profile, setProfile] = useState({ photoURL: "", fullName: "" });

  // Fetch profile
  useEffect(() => {
    if (!currentUser) return;
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            photoURL: data.photoURL || currentUser.photoURL || "",
            fullName: data.fullName || currentUser.displayName || "User",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // Messages listener
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, `messages/${currentUser.uid}/inbox`));
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessageCount(msgs.filter(msg => !msg.readAt).length);
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
    new Audio("/notification.mp3").play().catch(err => console.log(err));
  };

  useEffect(() => {
    if (!currentUser) return;
    setIsAdmin(currentUser.uid === 'msLzg2LxX7Rd3WKVwaqmhWl9KUk2');
  }, [currentUser]);

  // Theme toggle
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
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
      toast.push('Logged out successfully!', { type: 'info' });
      navigate('/login');
    } catch (err) {
      toast.push('Logout failed!', { type: 'error' });
      console.error(err);
    }
  };

  const handleLinkClick = () => { if (isMobile) setSidebarOpen(false); };
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const baseClasses = "flex items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 group";
  const inactive = "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";
  const active = "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/50";

  return (
    <>
      <style>
{`}
          @keyframes sparkleAnim {
            0% { background-position: 0 0; }
            50% { background-position: 50px 50px; }
            100% { background-position: 0 0; }
          }

          /* Glow effect for profile image */
          .glow-border {
            box-shadow: 0 0 10px rgba(99,102,241,0.5), 0 0 20px rgba(139,92,246,0.3), 0 0 30px rgba(236,72,153,0.2);
            transition: box-shadow 0.3s ease-in-out;
          }
          .glow-border:hover {
            box-shadow: 0 0 15px rgba(99,102,241,0.7), 0 0 25px rgba(139,92,246,0.5), 0 0 40px rgba(236,72,153,0.3);
          }
        `}
      </style>

      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar-hide-scroll bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800 shadow-md w-64 py-4 px-2 max-h-screen fixed inset-y-0 left-0 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-50 overflow-y-scroll`}>

        {/* Header */}
        <div className="flex justify-between items-center px-4 mb-6">
          <img src={logo} alt="logo" className='w-6 h-6' />
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Portfolink</h2>
          {isMobile && <button onClick={() => setSidebarOpen(false)}><FaTimes className="text-gray-600 dark:text-white" /></button>}
        </div>

        {/* Profile */}
        {currentUser && (
          <div className="relative flex flex-col items-center text-center px-4 py-4 mb-6 border-y border-gray-200 dark:border-gray-700">
            <div className="relative w-16 h-16 rounded-full glow-border overflow-hidden">
              <img src={profile.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="User Avatar" className="w-16 h-16 rounded-full object-cover" />
              <div className="sparkle"></div>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">{profile.fullName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">{currentUser.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <Link to="/dashboard" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard") ? active : inactive}`}><FaHome /> Home</Link>
          <Link to="/dashboard/profile" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/profile") ? active : inactive}`}><FaUser /> Profile</Link>

          {/* Portfolio */}
          <div>
            <button onClick={() => setPortfolioOpen(!portfolioOpen)} className={`${baseClasses} ${location.pathname.startsWith("/dashboard/portfolio") ? active : inactive} w-full flex justify-between items-center`}>
              <span className="flex items-center gap-2"><FaIdBadge /> Portfolio</span>
              <span className="text-xs">{portfolioOpen ? '▲' : '▼'}</span>
            </button>
            {portfolioOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <Link to="/dashboard/portfolio" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/portfolio") ? active : inactive}`}>View/Edit</Link>
                <Link to="/dashboard/portfolio/resume" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/portfolio/resume") ? active : inactive}`}>Generate Resume</Link>
              </div>
            )}
          </div>

          <Link to="/dashboard/projects" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/projects") ? active : inactive}`}><FaProjectDiagram /> Projects</Link>

          {/* Marketplace */}
          <Link to="/dashboard/marketplace" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/marketplace") ? active : inactive}`}>
            <FaShoppingCart className="text-gray-500 dark:text-gray-300 group-hover:text-white group-hover:animate-pulse" />
            Marketplace
          </Link>

          <Link to="/dashboard/messages" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/messages") ? active : inactive}`}>
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2"><FaEnvelope /> Messages</span>
              {messageCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{messageCount}</span>}
            </div>
          </Link>

          {currentUser && isAdmin && <Link to="/dashboard/post" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/post") ? active : inactive}`}><FaEdit /> Add Post</Link>}

          <Link to="/dashboard/about" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/about") ? active : inactive}`}><FaInfoCircle /> About Web</Link>
          <Link to="/dashboard/settings" onClick={handleLinkClick} className={`${baseClasses} ${isActive("/dashboard/settings") ? active : inactive}`}><FaTools /> Settings</Link>

          <button onClick={handleLogout} className="flex items-center w-full text-left text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 py-2.5 px-4 rounded-md">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </nav>

        {/* Dark Mode */}
        <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button onClick={toggleDarkMode} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 text-sm">
            {isDarkMode ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
