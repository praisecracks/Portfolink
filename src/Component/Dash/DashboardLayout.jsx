import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  // Listen for unread messages for the current user and show a badge.
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'messages'),
      where('to', '==', user.uid),
      where('read', '==', false)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size || 0);
    }, (err) => {
      console.error('Failed to listen for unread messages', err);
    });

    return () => unsub();
  }, [user]);

  // Dynamic header title based on current route
  const location = useLocation();
  const pageTitle = React.useMemo(() => {
    const path = location.pathname.replace(/^\/+|\/+$/g, ''); // trim slashes
    // If path is empty or root of dashboard, show Dashboard
    if (!path) return 'Dashboard';
    // take last segment as name
    const parts = path.split('/');
    const last = parts[parts.length - 1];
    // map common routes to friendly names
    const map = {
      dashboard: 'Dashboard',
      profile: 'Profile',
      messages: 'Messages',
      projects: 'Projects',
      portfolio: 'Portfolio',
      posts: 'Posts',
      settings: 'Settings'
    };
    return map[last] || last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }, [location.pathname]);

  return (
      <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-inter transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Top Nav */}
        <header className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm dark:shadow-md px-4 py-3 md:hidden transition-colors duration-200">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-indigo-600">
            <FaBars size={20} />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">{pageTitle}</h2>

            {/* Notification bell - links to messages */}
            <Link to="/dashboard/messages" className="relative text-indigo-600 dark:text-indigo-300">
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User avatar - links to profile */}
            {user ? (
              <Link to="/dashboard/profile" aria-label="Your profile">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`}
                  alt={user.displayName || 'User avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-700 transition-shadow duration-200"
                />
              </Link>
            ) : (
              <Link to="/dashboard/profile" aria-label="Your profile">
                <img
                  src={'https://ui-avatars.com/api/?name=User'}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover transition-shadow duration-200"
                />
              </Link>
            )}
          </div>
        </header>

        {/* Desktop top bar intentionally hidden so the dynamic header shows only on mobile */}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
