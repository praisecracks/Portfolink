// src/Component/Marketplace/Marketplace.jsx
import React, { useState } from "react";
import JobList from "./pages/JobList";
import JobForm from "./components/JobForm";
import MyJobs from "./pages/MyJobs";
import AdminRequests from "./pages/AdminRequests";
import { auth } from "../../firebase";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Briefcase, Filter, ArrowLeft } from "lucide-react";

export default function Marketplace() {
  const [activeView, setActiveView] = useState("list"); // "list" | "post" | "myjobs"

  const adminUIDs = [
    'msLzg2LxX7Rd3WKVwaqmhWl9KUk2',
  ];

  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUserUid(u ? u.uid : null));
    return () => unsub();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case "post":
        return <JobForm />;
      case "requests":
        return <AdminRequests />;
      case "myjobs":
        return <MyJobs />;
      default:
        return <JobList />;
    }
  };

  return (
    <div
      className="min-h-screen font-inter p-6 transition-colors duration-300 
      bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 
      text-gray-800 
      dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] dark:text-gray-200"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          {(activeView === "post" || activeView === "myjobs") && (
            <button
              onClick={() => setActiveView("list")}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 transition"
            >
              <ArrowLeft size={18} className="text-gray-700 dark:text-gray-200" />
            </button>
          )}
          <div>
            <h1
              className="text-3xl font-bold 
              bg-gradient-to-r from-indigo-500 to-pink-500 
              bg-clip-text text-transparent"
            >
              Portfolink Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Find jobs, hire talent, or showcase your skills 🚀
            </p>
          </div>
        </div>

        {activeView === "list" && (
          <div className="flex gap-3 mt-4 md:mt-0">
            {/* Post Job Button */}
            <button
              onClick={() => setActiveView("post")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold
              bg-indigo-600 hover:bg-indigo-700 
              dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
            >
              <Plus size={16} />
              Post a Job
            </button>

            {/* My Jobs Button */}
            <button
              onClick={() => setActiveView("myjobs")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold
              bg-pink-600 hover:bg-pink-700 
              dark:bg-pink-500 dark:hover:bg-pink-600 transition"
            >
              <Briefcase size={16} />
              My Jobs
            </button>

            {/* Admin Requests */}
            {adminUIDs.includes(userUid) && (
              <button onClick={() => setActiveView('requests')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500 text-white">Admin Requests</button>
            )}
          </div>
        )}
      </motion.div>

      {/* Filters Row (only show in job list view) */}
      {activeView === "list" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          <div
            className="flex items-center rounded-lg px-3 py-2 border transition
            bg-white border-gray-200 
            dark:bg-white/10 dark:border-white/20"
          >
            <Filter size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="bg-transparent outline-none text-sm w-48 md:w-64 
                text-gray-800 placeholder-gray-400 
                dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <select
            className="rounded-lg px-3 py-2 text-sm outline-none border transition
            bg-white border-gray-200 text-gray-800
            dark:bg-white/10 dark:text-white dark:border-white/20"
          >
            <option value="">All Types</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
          </select>

          <select
            className="rounded-lg px-3 py-2 text-sm outline-none border transition
            bg-white border-gray-200 text-gray-800
            dark:bg-white/10 dark:text-white dark:border-white/20"
          >
            <option value="">Sort by</option>
            <option value="latest">Latest</option>
            <option value="budget">Highest Budget</option>
          </select>
        </motion.div>
      )}

      {/* Main Grid Area */}
      {activeView === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section (Job List) */}
          <div className="lg:col-span-2">{renderContent()}</div>

          {/* Right Section (Sidebar) */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl border backdrop-blur-md transition
                bg-white border-gray-200 
                dark:bg-white/10 dark:border-white/20"
            >
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Popular Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {["React", "UI/UX", "Firebase", "Tailwind", "Backend"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-full transition
                      bg-gray-100 text-gray-700 
                      dark:bg-white/10 dark:text-gray-200"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl border backdrop-blur-md transition
                bg-white border-gray-200 
                dark:bg-white/10 dark:border-white/20"
            >
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Top Recruiters
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>Portfolink Inc</li>
                <li>NextDev Studio</li>
                <li>CodeWorks Agency</li>
              </ul>
            </motion.div>
          </div>
        </div>
      ) : (
        <div>{renderContent()}</div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs mt-12 text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Portfolink Marketplace. Built with ❤️ by
        Praisecrack.
      </footer>
    </div>
  );
}
