
import { FiImage } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEdit,
  FaSave,
  FaCopy,
} from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Profile from '../../assets/profile.png';

const COMMON_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'CSS', 'HTML',
  'TypeScript', 'MongoDB', 'Firebase', 'Docker', 'AWS', 'Git', 'Tailwind', 'Next.js'
];

function Portfolio() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [category, setCategory] = useState('All');
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [portfolioURL, setPortfolioURL] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
  if (!portfolioURL) return;

  navigator.clipboard.writeText(portfolioURL).then(() => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  });
};

// ...existing code...

// Add these inside your Portfolio component, above the return statement:

const handleInputChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

const handleSocialChange = (network, value) => {
  setFormData((prev) => ({
    ...prev,
    socialLinks: { ...prev.socialLinks, [network]: value },
  }));
};

const toggleSkill = (skill) => {
  setFormData((prev) => ({
    ...prev,
    skills: prev.skills.includes(skill)
      ? prev.skills.filter((s) => s !== skill)
      : [...prev.skills, skill],
  }));
};



const addCustomSkill = () => {
  const skill = formData.customSkill.trim();
  if (skill && !formData.skills.includes(skill)) {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
      customSkill: '',
    }));
  }
};

const removeEducation = (idx) => {
  setFormData((prev) => ({
    ...prev,
    education: prev.education.filter((_, i) => i !== idx),
  }));
};

const updateEducation = (idx, field, value) => {
  setFormData((prev) => ({
    ...prev,
    education: prev.education.map((edu, i) =>
      i === idx ? { ...edu, [field]: value } : edu
    ),
  }));
};

const addEducation = () => {
  setFormData((prev) => ({
    ...prev,
    education: [
      ...prev.education,
      { degree: '', school: '', years: '', note: '' },
    ],
  }));
};

const saveProfile = async () => {
  if (!user) return;
  try {
    await setDoc(doc(db, 'users', user.uid), {
      ...formData,
      socialLinks: { ...formData.socialLinks },
      skills: [...formData.skills],
      education: [...formData.education],
    });
    setIsEditing(false);
  } catch (err) {
    alert('Failed to save profile');
    console.error(err);
  }
};

// ...existing code...
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    photoURL: '',
    socialLinks: { github: '', linkedin: '', twitter: '' },
    skills: [],
    education: [],
    customSkill: '',
  });

  const categories = ['All', 'Web', 'Mobile', 'Design'];
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    if (!user) {
      setProfileData(null);
      setIsLoadingProfile(false);
      setPortfolioURL('');
      return;
    }

    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const profile = {
            fullName: data.fullName || user.displayName || 'Unnamed User',
            title: data.title || 'Start Developer & Designer',
            bio: data.bio || 'Passionate about building awesome apps.',
            photoURL: data.photoURL || user.photoURL || '/default-avatar.png',
            socialLinks: {
              github: data.github || '',
              linkedin: data.linkedin || '',
              twitter: data.twitter || '',
              ...data.socialLinks,
            },
            skills: data.skills || [],
            education: data.education || [],
          };

          setProfileData(profile);
          setFormData({ ...profile, customSkill: '' });
          setPortfolioURL(`${window.location.origin}/portfolio/${user.uid}`);
        } else {
          const fallback = {
            fullName: user.displayName || '',
            title: '',
            bio: '',
            photoURL: user.photoURL || '',
            socialLinks: { github: '', linkedin: '', twitter: '' },
            skills: [],
            education: [],
            customSkill: '',
          };
          setProfileData(null);
          setFormData(fallback);
          setPortfolioURL(`${window.location.origin}/portfolio/${user.uid}`);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setIsLoadingProjects(true);
    const q = query(collection(db, 'portfolio'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(userProjects);
        setFilteredProjects(userProjects);
        setIsLoadingProjects(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setIsLoadingProjects(false);
      }
    );
    return () => unsubscribe();
  }, [user]);



const [contactForm, setContactForm] = useState({
  name: '',
  email: '',
  message: '',
});

const handleContactChange = (e) => {
  setContactForm((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};



const handleContactSubmit = async (e) => {
  e.preventDefault();

  if (!user?.uid) {
    toast.error("Unable to identify owner.");
    return;
  }

  const msg = {
    ...contactForm,
    createdAt: new Date(),
  };

  try {
    await addDoc(
      collection(doc(db, 'messages', user.uid), 'inbox'),
      msg
    );
    toast.success("Message sent successfully!");
    setContactForm({ name: '', email: '', message: '' });
  } catch (err) {
    console.error("Message send failed:", err);
    toast.error("Failed to send message.");
  }
};





  useEffect(() => {
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) =>
        p.tags?.includes(category.toLowerCase())
      ));
    }
  }, [category, projects]);
  if (isLoadingProfile)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-20 text-gray-700">
        Please log in to view your portfolio.
      </div>
    );

  if (!profileData)
    return (
      <div className="text-center mt-20 text-gray-700">
        No profile data found. You can start editing to create your portfolio.
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Edit Portfolio
        </button>
      </div>
    );

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto bg-white text-gray-900">
      {/* Profile Section */}
      <section className="flex flex-col items-center gap-4 mb-12">
        <div className="relative w-28 h-28 rounded-full border-4 border-indigo-600 overflow-hidden">
          <img
            src={
              profileData.photoURL?.trim()
                ? profileData.photoURL
                : Profile
            }
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Profile;
            }}
          />
        </div>

        {portfolioURL && !isEditing && (
          <div className="flex items-center gap-3 bg-indigo-100 rounded px-4 py-2 text-indigo-700 font-medium select-all cursor-pointer max-w-xl">
            <a
              href={portfolioURL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-indigo-900 truncate max-w-[80vw]"
            >
              {portfolioURL}
            </a>
            <button
              onClick={copyToClipboard}
              className="text-indigo-600 hover:text-indigo-900"
              aria-label="Copy portfolio link"
              title="Copy link"
            >
              <FaCopy />
            </button>
            {copySuccess && (
              <span className="text-green-600 font-semibold ml-2">
                Copied!
              </span>
            )}
          </div>
        )}

        {isEditing ? (
          <div className="w-full max-w-2xl p-6">
            {/* Full Name */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                style={{outline: "none"}}
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                style={{outline: "none"}}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Bio</label>
              <textarea
                rows={3}
               style={{outline: "none"}}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell something about yourself"
                className="w-full border rounded px-3 py-2 resize-y"
              />
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Social Links</h3>
              {['github', 'linkedin', 'twitter'].map((network) => (
                <div key={network} className="flex items-center gap-3 mb-3">
                  <label className="capitalize w-20">{network}</label>
                  <input
                    type="url"
                    value={formData.socialLinks[network] || ''}
                    onChange={(e) => handleSocialChange(network, e.target.value)}
                    placeholder={`https://${network}.com/yourprofile`}
                    className="flex-1 border rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {COMMON_SKILLS.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 bg-indigo-100 rounded px-3 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="cursor-pointer"
                    />
                    <span className="text-indigo-800">{skill}</span>
                  </label>
                ))}
              </div>

              {/* Custom Skill */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom skill"
                  value={formData.customSkill}
                  onChange={(e) => handleInputChange('customSkill', e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
            {/* Education */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Education</label>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="mb-3 p-3 border rounded relative space-y-2">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-1 right-1 text-red-600 hover:text-red-900 font-bold"
                    aria-label="Remove education"
                  >
                    &times;
                  </button>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Years"
                    value={edu.years}
                    onChange={(e) => updateEducation(idx, 'years', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  <textarea
                    rows={2}
                    placeholder="Note (optional)"
                    value={edu.note}
                    onChange={(e) => updateEducation(idx, 'note', e.target.value)}
                    className="w-full border rounded px-3 py-2 resize-y"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addEducation}
                className="mt-2 px-4 py-2 bg-green-100 rounded hover:bg-green-200 transition"
              >
                Add Education
              </button>
            </div>

            {/* Photo URL */}
            <div className="mb-6">
              <label className="block font-semibold mb-1">Photo URL</label>
              <input
                type="url"
                value={formData.photoURL}
                onChange={(e) => handleInputChange('photoURL', e.target.value)}
                placeholder="Link to your profile image"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Save / Cancel buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-red-100 hover:bg-red-300 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
              >
                <FaSave /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-indigo-700">{profileData.fullName}</h1>
            <p className="text-lg text-gray-700 mt-1">{profileData.title}</p>
            <p className="mt-4 max-w-xl text-gray-600 whitespace-pre-line">{profileData.bio}</p>

            {/* Social Links */}
            <div className="flex justify-center space-x-8 mt-5 text-indigo-600 text-2xl">
              {profileData.socialLinks.github && (
                <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
              )}
              {profileData.socialLinks.linkedin && (
                <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              )}
              {profileData.socialLinks.twitter && (
                <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              )}
            </div>

            {/* Skills */}
            <section className="mt-10 flex flex-wrap justify-center gap-3">
              {profileData.skills.length === 0 ? (
                <p className="text-gray-500">No skills added</p>
              ) : (
                profileData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              )}
            </section>

            {/* Education */}
            <section className="mt-10 text-left max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Education</h2>
              <div className="space-y-4">
                {profileData.education.length === 0 ? (
                  <p className="text-gray-500">No education details added</p>
                ) : (
                  profileData.education.map(({ school, degree, years, note }, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-bold text-lg text-gray-700">{degree || 'Degree'}</h3>
                      <p className="text-indigo-600">{school || 'School'}</p>
                      <p className="text-gray-500 text-sm">{years || 'Years'}</p>
                      {note && <p className="text-gray-600 mt-1 italic whitespace-pre-line">{note}</p>}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </section>

{/* Project Section */}
<section className="max-w-5xl mx-auto px-4 py-10">
  {/* Category Filter Buttons */}
  <div className="flex justify-center flex-wrap gap-2 mb-8">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => setCategory(cat)}
        className={`px-4 py-2 rounded ${
          category === cat
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
        }`}
      >
        {cat}
      </button>
    ))}
  </div>

  {/* Loading & Empty State */}
  {isLoadingProjects ? (
    <div className="flex justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
    </div>
  ) : filteredProjects.length === 0 ? (
    <p className="text-center text-gray-500">No projects found.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-4 cursor-pointer"
          onClick={() => setSelectedProject(project)}
        >
          {project.imageURL ? (
            <img
              src={project.imageURL}
              alt={project.title}
              className="rounded-md object-cover h-40 w-full mb-3"
            />
          ) : (
            <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md mb-3">
              <FiImage className="text-3xl text-gray-400" />
            </div>
          )}

          <h3 className="text-lg font-semibold text-indigo-700">
            {project.title}
          </h3>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {project.description?.slice(0, 80)}...
          </p>

          {project.tags && project.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  {/* Modal for Full Project View */}
  {selectedProject && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 px-4"
      onClick={() => setSelectedProject(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative"
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
          onClick={() => setSelectedProject(null)}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-3">
          {selectedProject.title}
        </h2>

        {selectedProject.imageURL && (
          <img
            src={selectedProject.imageURL}
            alt={selectedProject.title}
            className="rounded mb-4 w-full max-h-60 object-cover"
          />
        )}

        <p className="text-gray-700 whitespace-pre-line mb-4">
          {selectedProject.description || "No description provided."}
        </p>

        {selectedProject.category && (
          <p className="text-sm text-gray-500 mb-2">
            <strong className="text-gray-700">Category:</strong> {selectedProject.category}
          </p>
        )}

        {selectedProject.tags?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Tech Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedProject.github && (
          <div className="mt-2">
            <span className="text-sm font-semibold text-gray-700">GitHub:</span>{' '}
            <span className="text-sm text-blue-600 break-all">{selectedProject.github}</span>
          </div>
        )}


        {/* Delete Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={async () => {
            const confirm = window.confirm("Delete this project permanently?");
            if (!confirm) return;

            try {
              // Try to delete from both collections, but don't fail if one doesn't exist
              await Promise.allSettled([
                deleteDoc(doc(db, "portfolio", selectedProject.id)),
                deleteDoc(doc(db, "projects", selectedProject.fromProjectId || selectedProject.id)),
              ]);
              toast.success("Project deleted successfully!");
              setSelectedProject(null);
            } catch (err) {
              console.error("Deletion error:", err);
              toast.error("Failed to delete project.");
            }
          }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  )}
</section>


{/* contact page */}
<section className="mt-20 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
  <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Contact Me</h2>
  <p className="text-center text-gray-600 mb-8">Have a project in mind or want to connect? Send me a message and I'll get back to you soon!</p>

  <form
    onSubmit={handleContactSubmit}
    className="space-y-6"
  >
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        type="text"
        style={{outline: "none"}}
        id="name"
        name="name"
        required
        value={contactForm.name}
        onChange={handleContactChange}
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-md px-4 py-2 shadow-sm transition"
        placeholder="e.g. John Doe"
      />
    </div>

    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        value={contactForm.email}
        onChange={handleContactChange}
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-md px-4 py-2 shadow-sm transition"
        placeholder="e.g. john@example.com"
      />
    </div>

    <div>
      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
      <textarea
        id="message"
        name="message"
        rows={5}
        required
        value={contactForm.message}
        onChange={handleContactChange}
        className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 rounded-md px-4 py-2 shadow-sm transition resize-y"
        placeholder="Write your message here..."
      />
    </div>

    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-200 shadow"
      >
        ✉️ Send Message
      </button>
    </div>
  </form>
</section>






      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-8 px-5 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center mx-auto gap-2"
        >
          <FaEdit /> Edit Portfolio
        </button>
      )}
    </div>
  );
}

export default Portfolio;
