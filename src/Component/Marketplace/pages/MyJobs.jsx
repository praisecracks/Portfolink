// src/Component/Marketplace/pages/MyJobs.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import JobCard from "../components/JobCard";
import { motion } from "framer-motion";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);

  const adminUIDs = [
    "msLzg2LxX7Rd3WKVwaqmhWl9KUk2",
    "szLDKXmH1ngz6y05MGQ0cJzkbP13",
    "24h8H3BlI2hqUi4OCh3ERz3Rgai2",
  ];

  useEffect(() => {
    let unsubscribeJobs = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setLoading(true); // start loading whenever auth changes

      if (user) {
        setUserUid(user.uid);
        const isAdmin = adminUIDs.includes(user.uid);

        // Build query
        const jobsRef = collection(db, "jobs");
        const q = isAdmin
          ? query(jobsRef)
          : query(jobsRef, where("postedBy", "==", user.uid));

        // Listen in real-time
        unsubscribeJobs = onSnapshot(
          q,
          (snapshot) => {
            const jobList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setJobs(jobList);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching jobs:", error);
            setJobs([]);
            setLoading(false);
          }
        );
      } else {
        setUserUid(null);
        setJobs([]);
        setLoading(false);
      }
    });

    // Cleanup both auth and jobs listener
    return () => {
      unsubscribeAuth();
      if (unsubscribeJobs) unsubscribeJobs();
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        Loading jobs...
      </div>
    );
  }

  if (!userUid) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        Please log in to view your jobs.
      </div>
    );
  }

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white"
      >
        {adminUIDs.includes(userUid) ? "All Posted Jobs" : "My Posted Jobs"}
      </motion.h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
