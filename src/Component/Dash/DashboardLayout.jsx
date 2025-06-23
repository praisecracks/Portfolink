import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 font-inter">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Top Nav */}
        <header className="flex justify-between items-center bg-white shadow px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-indigo-600">
            <FaBars size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-indigo-600">Dashboard</h2>
            {user && (
              <img
                src={user.photoURL || 'https://ui-avatars.com/api/?name=User'}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
