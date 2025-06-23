import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaProjectDiagram,
  FaIdBadge,
  FaMoon,
  FaSun,
  FaTimes,
  FaEdit,
  FaInfoCircle,
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = auth.currentUser;

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
  if (!currentUser) {
    setIsAdmin(false);
    return;
  }

  // Hardcode your admin UID for testing
  const adminUID = 'msLzg2LxX7Rd3WKVwaqmhWl9KUk2';

  if (currentUser.uid === adminUID) {
    setIsAdmin(true);
  } else {
    setIsAdmin(false);
  }
}, [currentUser]);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
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
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to check if link is active for aria-current and style
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
          <h2 className="text-2xl font-bold text-indigo-600 flex-grow text-center dark:text-indigo-400">
            Portfolink
          </h2>

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Sidebar"
              className="text-gray-600 hover:text-gray-900 focus:outline-none ml-2 dark:text-gray-300 dark:hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          )}
        </div>

        <nav className="mt-10 flex flex-col gap-1" role="navigation">
          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className={`${linkBaseClasses} ${
              isActive("/dashboard") ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            <FaHome className="inline-block mr-2 w-5 h-5" />
            Home
          </Link>

          <Link
            to="/dashboard/profile"
            onClick={handleLinkClick}
            className={`${linkBaseClasses} ${
              isActive("/dashboard/profile") ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-current={isActive("/dashboard/profile") ? "page" : undefined}
          >
            <FaUser className="inline-block mr-2 w-5 h-5" />
            Profile
          </Link>

          <Link
            to="/dashboard/portfolio"
            onClick={handleLinkClick}
            className={`${linkBaseClasses} ${
              isActive("/dashboard/portfolio") ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-current={isActive("/dashboard/portfolio") ? "page" : undefined}
          >
            <FaIdBadge className="inline-block mr-2 w-5 h-5" />
            Portfolio
          </Link>

          <Link
            to="/dashboard/projects"
            onClick={handleLinkClick}
            className={`${linkBaseClasses} ${
              isActive("/dashboard/projects") ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-current={isActive("/dashboard/projects") ? "page" : undefined}
          >
            <FaProjectDiagram className="inline-block mr-2 w-5 h-5" />
            Projects
          </Link>

          {/* Only visible if admin */}
          {currentUser && isAdmin && (
            <Link
              to="/dashboard/post"
              onClick={handleLinkClick}
              className={`${linkBaseClasses} ${
                isActive("/dashboard/add-post") ? linkActiveClasses : linkInactiveClasses
              }`}
              aria-current={isActive("/dashboard/add-post") ? "page" : undefined}
            >
              <FaEdit className="inline-block mr-2 w-5 h-5" />
              Add Post
            </Link>
          )}

          <Link
            to="/dashboard/about"
            onClick={handleLinkClick}
            className={`${linkBaseClasses} ${
              isActive("/dashboard/about") ? linkActiveClasses : linkInactiveClasses
            }`}
            aria-current={isActive("/dashboard/about") ? "page" : undefined}
          >
            <FaInfoCircle className="inline-block mr-2 w-5 h-5" />
            About Web
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left py-2.5 px-4 rounded transition-colors duration-200 hover:bg-red-100 text-red-600 dark:text-red-400 dark:hover:bg-red-700"
          >
            <FaSignOutAlt className="inline-block mr-2 w-5 h-5" />
            Logout
          </button>
        </nav>

        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="text-gray-700 dark:text-gray-300 focus:outline-none flex items-center gap-2"
          >
            {isDarkMode ? (
              <>
                <FaSun size={22} />
                <span className="hidden md:inline select-none text-sm font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <FaMoon size={22} />
                <span className="hidden md:inline select-none text-sm font-medium">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
