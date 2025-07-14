import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { auth, googleProvider, githubProvider } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import regiterart from '../../assets/register-art.png';
import { fetchSignInMethodsForEmail, linkWithCredential } from 'firebase/auth';


function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loadingProvider, setLoadingProvider] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.includes('@')) newErrors.email = "Enter a valid email.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    try {
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        name: formData.name,
        email: formData.email,
        provider: "email/password",
        createdAt: new Date()
      });
      toast.success("Account created successfully ✅");
      navigate('/login');
    } catch (err) {
      toast.error("Error creating account");
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
      createdAt: new Date()
    });

    toast.success(`Signed in with ${providerName}`);
    navigate('/dashboard');
  } catch (err) {
    // Handle account exists with different credential
    if (err.code === 'auth/account-exists-with-different-credential') {
      const pendingCred = err.credential;
      const email = err.customData.email;

      try {
        // Get the list of sign-in methods associated with this email
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes('password')) {
          toast.error(`An account already exists with this email. Try logging in with email/password.`);
        } else if (methods.includes('google.com')) {
          toast.error(`An account already exists with Google. Please sign in with Google.`);
        } else {
          toast.error(`An account already exists with a different provider.`);
        }
      } catch (fetchErr) {
        console.error(fetchErr);
        toast.error('Error fetching sign-in methods');
      }
    } else {
      console.error(err);
      toast.error(`${providerName} sign-in failed`);
    }
  } finally {
    setLoadingProvider(null);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full items-center">
        {/* Animation */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block"
        >
          <motion.img
            src={regiterart}
            alt="Animated Illustration"
            className="w-full max-w-md mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg border border-indigo-200 w-full"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            Create Your Portfolink Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Create Account
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleProviderLogin("Google", googleProvider)}
              disabled={loadingProvider === "Google"}
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-red-500" />
              {loadingProvider === "Google" ? "Signing in..." : "Sign up with Google"}
            </button>
            <button
              onClick={() => handleProviderLogin("GitHub", githubProvider)}
              disabled={loadingProvider === "GitHub"}
              className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FaGithub className="text-gray-800" />
              {loadingProvider === "GitHub" ? "Signing in..." : "Sign up with GitHub"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
