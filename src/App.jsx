import { Routes, Route, useLocation } from "react-router-dom";
import Home from './Component/Lander/Home';
import Register from "./Component/RegisterPage/Register";
import Login from './Component/RegisterPage/Login..jsx';
import Dashboard from './Component/Dash/Dashboard';
import Projects from './Component/Dash/Projects';
// import Settings from './Component/Dash/Settings';
import DashboardLayout from './Component/Dash/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Component/Dash/Sidebar.jsx";
import Profile from "./Component/Dash/Profile.jsx";
import Portfolio from "./Component/Dash/Portfolio.jsx";
import PortfolioView from "./Component/Dash/PortfolioView.jsx";
import About from "./Component/Dash/About.jsx";
import Post from "./Component/Dash/Post.jsx";
import Messages from "./Component/Dash/Message.jsx";
import Chat from "./Component/Dash/Chat.jsx";

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        
    <Routes location={location} key={location.pathname}>
  <Route path='/' element={<Home />} />
  <Route path='/register' element={<Register />} />
  <Route path='/login' element={<Login />} />

  {/* Public portfolio view route */}
  <Route path='/portfolio/:uid' element={<PortfolioView />} />

  <Route path='/dashboard' element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path='profile' element={<Profile />} />
    <Route path='projects' element={<Projects />} />
    <Route path='portfolio' element={<Portfolio />} />
        <Route path='about' element={<About/>} />
       <Route path='post' element={<Post/>} />
    <Route path='messages' element={<Messages />} /> 
    <Route path='chat' element={<Chat/>} /> 
\
  </Route>
</Routes>




      </AnimatePresence>

      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
