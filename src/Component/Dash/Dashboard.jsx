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
  FaTimes,
  FaBullhorn,
  FaExclamationCircle,
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) return 0;
    const requiredFields = ['fullName', 'email', 'bio', 'photoURL', 'phoneNumber'];
    const filled = requiredFields.filter((field) => profileData[field]);
    return Math.round((filled.length / requiredFields.length) * 100);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

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

  useEffect(() => {
    if (!user?.uid) return;

    async function fetchProjects() {
      setLoadingProjects(true);
      try {
        const q = query(
          collection(db, 'portfolio'),
          where('userId', '==', user.uid),
          limit(3)
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

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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




  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Please log in to access your dashboard.</h2>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Go to Login
        </a>
      </div>
    );
  }

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
<section>
  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
    Welcome back,{' '}
    <span className="text-indigo-600">
      {profile?.fullName || user.displayName || 'User'}
    </span>
    !
  </h1>
  <p className="mt-2 text-base text-gray-600 dark:text-gray-400 max-w-xl">
    Manage your projects, update your profile, and track your portfolio here.
  </p>
</section>

{/* Announcement Section */}
<section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-none w-full max-w-6xl mx-auto text-base">  <div className="flex items-center mb-5 space-x-3">
    <FaBullhorn className="text-indigo-600 w-6 h-6" />
    <h2 className="text-center text-red-500 dark:text-red-400 font-semibold">Announcement</h2>
  </div>

  {isAdmin && (
    <form onSubmit={handlePostSubmit} className="mb-6">
      <textarea
        className="w-full border border-indigo-300 rounded-md p-3 text-gray-700 text-sm resize-none"
        rows={4}
        placeholder="Write a new announcement..."
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        required
      />
      <button
        type="submit"
        className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-500 text-sm"      >
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
        className="bg-indigo-50 dark:bg-gray-700 p-5 rounded-md border border-indigo-200 dark:border-indigo-500 text-gray-800 dark:text-gray-200 mb-4 text-sm"
      >
        <p className="whitespace-pre-wrap">{post.content}</p>
        <small className="block mt-2 text-indigo-600 italic">
          {post.authorName ? `Posted by ${post.authorName} · ` : ''}
          {post.createdAt?.toDate
            ? post.createdAt.toDate().toLocaleString()
            : 'Just now'}
        </small>
      </div>
    ))
  )}

  <div className="mt-6 flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-gray-700 rounded-md p-3 border border-indigo-200 dark:border-indigo-500">
    <FaExclamationCircle className="w-5 h-5" />
    <p>Reminder: Announcements posted here are visible to all users immediately.</p>
  </div>
</section>

{/* Stats */}
<section className="text-base grid grid-cols-1 sm:grid-cols-3 gap-6">
  <Stat icon={<FaUserCircle />} label="Profile Completeness" value={`${calculateProfileCompleteness(profile)}%`} />
  <Stat icon={<FaFolderOpen />} label="Your Projects" value={projects.length} />
  <Stat icon={<FaTasks />} label="Recent Activity" value={projects.length} />
</section>





<section className="mt-10 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-sm">
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
















{/* Projects */}
<section>
  <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-500">Recent Projects</h2>
  {projects.length === 0 ? (


<div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg text-center">
  <h3 className="text-lg font-semibold text-indigo-700 dark:text-white">No projects yet</h3>
  <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
    You haven't added any projects to your portfolio.
  </p>
  <a
    href="/dashboard/portfolio"
    className="mt-4 inline-block bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 text-sm"
  >
    Add your first project
  </a>
</div>


  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 relative max-h-screen overflow-y-auto text-sm"
          onClick={() => setSelectedProject(project)}
        >
          <h3 className="font-semibold text-indigo-600 text-base mb-1 dark:text-indigo-700">{project.title}</h3>
          <p className="text-gray-700 dark:text-gray-400">{project.description?.slice(0, 120) || 'No description'}</p>
          <div className="mt-4 text-sm text-indigo-500 font-medium">View Details →</div>
        </div>
      ))}
    </div>
  )}
</section>

{/* Modal */}
{selectedProject && (
  <div
    // className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setSelectedProject(null)}
  >
  
  </div>
)}
    </div>
  );
}

const Stat = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-none flex items-center space-x-4">
    <div className="text-indigo-500 w-10 h-10">{icon}</div>
    <div>
      <p className="text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
    <Chat />
  </div>
);


export default Dashboard;
