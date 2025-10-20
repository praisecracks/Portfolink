import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useDarkMode } from "./Context/DarkModeContext";

import Home from './Component/Lander/Home';
import Register from "./Component/RegisterPage/Register";
import Login from './Component/RegisterPage/Login..jsx';
import Dashboard from './Component/Dash/Dashboard';
import Projects from './Component/Dash/Projects';
import DashboardLayout from './Component/Dash/DashboardLayout';
import Sidebar from "./Component/Dash/Sidebar.jsx";
import Profile from "./Component/Dash/Profile.jsx";
import Settings from "./Component/Dash/Settings.jsx";
import Portfolio from "./Component/Dash/Portfolio.jsx";
import PortfolioView from "./Component/Dash/PortfolioView.jsx";
import About from "./Component/Dash/About.jsx";
import Post from "./Component/Dash/Post.jsx";
import Messages from "./Component/Dash/Message.jsx";
import Chat from "./Component/Dash/Chat.jsx";
import ResumeGenerator from "./Component/Dash/ResumeGenerator.jsx";
import Marketplace from "./Component/Marketplace/Marketplace.jsx";
import NotFound from "./Component/NotFound.jsx";
import BlogPage from "./Component/Blog/BlogPage.jsx";
import JobDetails from "./Component/Marketplace/pages/JobDetails.jsx";
import MyJobs from "./Component/Marketplace/pages/MyJobs.jsx";
import PostJob from "./Component/Marketplace/pages/PostJob.jsx";

function App() {
  const location = useLocation();
  const { darkMode } = useDarkMode();

  // Auto-scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-indigo-400' : 'bg-white text-indigo-700'}`}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portfolio/:uid" element={<PortfolioView />} />
          <Route path="/view/:uid" element={<PortfolioView />} />

          {/* Dashboard nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/resume" element={<ResumeGenerator />} />
            <Route path="about" element={<About />} />
            <Route path="post" element={<Post />} />
            <Route path="messages" element={<Messages />} />
            <Route path="chat" element={<Chat />} />
          </Route>


          <Route path="marketplace">
          <Route index element={<Marketplace />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="job/:id" element={<JobDetails/>} />
          </Route>



          <Route path="BlogPage" element={<BlogPage/>} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/dashboard/marketplace/post-job" element={<JobForm />} /> */}
        </Routes>
      </AnimatePresence>

      {/* App uses internal ToastProvider; ToastContainer removed */}
    </div>
  );
}

export default App;
