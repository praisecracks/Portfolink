import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  FaFolderOpen,
  FaUserCircle,
  FaTasks,
  FaBullhorn,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import Chat from './Chat';

function Dashboard() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showProjects, setShowProjects] = useState(false);

  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) return 0;
    const requiredFields = ['fullName', 'email', 'bio', 'photoURL', 'phoneNumber'];
    const filled = requiredFields.filter((field) => profileData[field]);
    return Math.round((filled.length / requiredFields.length) * 100);
  };

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return setLoadingProfile(false);
      setLoadingProfile(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setIsAdmin(data.isAdmin || false);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Network problem. Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user?.uid]);

  // Fetch projects
  useEffect(() => {
    if (!user?.uid) return;

    async function fetchProjects() {
      setLoadingProjects(true);
      try {
        const q = query(
          collection(db, 'portfolio'),
          where('userId', '==', user.uid),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects.');
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, [user?.uid]);

  // Fetch posts (with image handling)
  useEffect(() => {
    if (!user) return;

    const q = collection(db, 'posts');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const postData = doc.data();
        return {
          id: doc.id,
          title: postData.title || '',
          content: postData.content || '',
          imageURL: postData.imageURL || null,
          authorId: postData.authorId || 'Unknown',
          authorName: postData.authorName || 'Anonymous',
          createdAt: postData.createdAt || null,
        };
      });

      // Sort posts by newest first
      data.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.seconds - a.createdAt.seconds;
      });

      setPosts(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content: newPost.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Admin',
        createdAt: serverTimestamp(),
      });
      setNewPost('');
    } catch (err) {
      console.error('Error posting:', err);
      alert('Failed to add post.');
    }
  };

  const generateChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    projects.forEach((project) => {
      const day = days[project.createdAt.getDay()];
      counts[day]++;
    });
    return days.map((day) => ({ name: day, Projects: counts[day] }));
  };

  const chartData = generateChartData();

  if (!user) return null;

  if (loadingProfile || loadingProjects) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="w-12 h-12 border-4 border-indigo-600 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-600 font-semibold">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 text-gray-800 dark:text-gray-100">
      {/* Welcome Section */}
      <section className="rounded-xl p-6 shadow-lg backdrop-blur-md border border-gray-200 dark:border-gray-700 transition-all bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-white">{profile?.fullName || user.displayName || 'User'}</span>!
        </h1>
        <p className="mt-2 text-base max-w-xl text-white/80">
          Manage your projects, update your profile, and track your portfolio here.
        </p>
      </section>

      {/* Announcements */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md w-full max-w-6xl mx-auto text-base backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all">
        <div className="flex items-center mb-5 space-x-3">
          <FaBullhorn className="text-indigo-600 w-6 h-6" />
          <h2 className="text-center text-red-500 dark:text-red-400 font-semibold">Announcement</h2>
        </div>

        {isAdmin && (
          <form onSubmit={handlePostSubmit} className="mb-6">
            <textarea
              className="w-full border border-indigo-300 dark:border-indigo-600 rounded-md p-3 text-gray-700 dark:text-gray-200 text-sm resize-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
              rows={4}
              placeholder="Write a new announcement..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-500 text-sm transition-all"
            >
              Post Announcement
            </button>
          </form>
        )}

        {posts.length === 0 ? (
          <p className="text-gray-600 italic text-sm">No announcements yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-indigo-50 dark:bg-gray-700 p-4 sm:p-5 rounded-md border border-indigo-200 dark:border-indigo-500 text-gray-800 dark:text-gray-200 mb-4 text-sm hover:shadow-lg transition-all"
            >
              {post.title && <h3 className="font-semibold text-indigo-600 mb-2">{post.title}</h3>}
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.imageURL && (
                <img
                  src={post.imageURL}
                  alt="Announcement"
                  className="mt-3 w-full object-cover rounded shadow-md h-36 sm:max-h-48"
                />
              )}
              <small className="block mt-2 text-indigo-600 italic dark:text-indigo-400">
                {post.authorName ? `Posted by ${post.authorName} · ` : ''}
                {post.createdAt ? post.createdAt.toDate().toLocaleString() : 'Just now'}
              </small>
            </div>
          ))
        )}
      </section>

      {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Stat icon={<FaUserCircle />} label="Profile Completeness" value={`${calculateProfileCompleteness(profile)}%`} />
            <Stat icon={<FaFolderOpen />} label="Your Projects" value={projects.length} />
            <Stat icon={<FaTasks />} label="Recent Activity" value={projects.length} />
          </section>

      {/* Activity Overview */}
      <section className="mt-10 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm focus:outline-none outline-none ring-0 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Activity Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="Projects" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Projects Dropdown */}
      <section className="mt-6">
        <button
          className="flex items-center justify-between w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all"
          onClick={() => setShowProjects(!showProjects)}
        >
          <span >Recent Projects</span>
          {showProjects ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {showProjects && (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg p-4 cursor-pointer transition transform hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(180deg, rgba(11,12,16,0.6), rgba(11,12,16,0.4))',
                  border: '1px solid rgba(99,102,241,0.12)',
                  boxShadow: '0 8px 30px rgba(99,102,241,0.06)'
                }}
              >
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="text-gray-300">{project.description || 'No description'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fixed Chat */}
      <Chat />
    </div>
  );
}

const Stat = ({ icon, label, value }) => (
  <div className="relative rounded-lg p-6 flex items-center space-x-4 transform hover:-translate-y-1" style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
    border: '1px solid rgba(255,255,255,0.04)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 24px rgba(2,6,23,0.06)'
  }}>
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 6px 18px rgba(139,92,246,0.25)' }}>{icon}</div>
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
      <p className="text-2xl font-bold text-indigo-600 dark:text-white">{value}</p>
    </div>
    {/* subtle persistent glow */}
    <div className="absolute -inset-px rounded-lg opacity-25 transition-opacity pointer-events-none" style={{ boxShadow: '0 10px 40px rgba(99,102,241,0.08)' }} />
  </div>
);

export default Dashboard;
