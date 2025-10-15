import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import logo from "../../assets/portLogo.png";
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRemember(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = "Enter a valid email.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      if (remember) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        provider: 'password',
        lastLogin: new Date(),
      }, { merge: true });

      toast.success("Welcome back!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (providerName, providerObj) => {
    try {
      setLoadingProvider(providerName);
      const result = await signInWithPopup(auth, providerObj);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || `${providerName} User`,
        email: user.email,
        photoURL: user.photoURL || null,
        provider: user.providerData[0]?.providerId || providerName,
        lastLogin: new Date(),
      }, { merge: true });

      toast.success(`Signed in with ${providerName}`);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData?.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes('google.com')) {
          toast.error("This email is already registered with Google. Try signing in with Google.");
        } else if (methods.includes('password')) {
          toast.error("This email is already registered with email/password.");
        } else {
          toast.error("This email is already registered with a different provider.");
        }
      } else {
        console.error(err);
        toast.error(`${providerName} sign-in failed`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) return toast.warning("Enter your email to reset password.");
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Failed to send reset email.");
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-200 font-inter">
      {/* Floating Animated Background Elements */}
      <motion.div
        className="absolute w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl top-10 left-10"
        animate={{ y: [0, 20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-pink-500/30 rounded-full blur-3xl bottom-10 right-10"
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Logo */}
      <motion.img
        src={logo}
        alt="Portfolink Logo"
        className="h-20 mb-6 z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-20 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Login to Portfolink
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400 pr-10"
            />
            <span
              className="absolute right-3 top-[36px] cursor-pointer text-gray-300"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((prev) => !prev)}
                className="accent-indigo-500"
              />
              Remember me
            </label>
            <button type="button" onClick={handleForgotPassword} className="text-indigo-400 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:scale-[1.02] transition duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-gray-500/30" />
          <span className="text-sm text-gray-400">OR</span>
          <hr className="flex-grow border-gray-500/30" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleProviderLogin('Google', googleProvider)}
            className="flex items-center justify-center gap-2 border border-gray-500/30 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {loadingProvider === 'Google' ? 'Signing in...' : (
              <>
                <FaGoogle className="text-red-400" />
                Login with Google
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleProviderLogin('GitHub', githubProvider)}
            className="flex items-center justify-center gap-2 border border-gray-500/30 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {loadingProvider === 'GitHub' ? 'Signing in...' : (
              <>
                <FaGithub className="text-gray-300" />
                Login with GitHub
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-medium">
            Create One
          </Link>
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Portfolink. Crafted with ❤️ by Praisecrack.
      </footer>
    </div>
  );
}

export default Login;
