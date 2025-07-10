import React, { useEffect, useState } from 'react';
import ProfileSection from './All Port/ProfilesSection';
import ProjectsSection from './All Port/ProjectsSection';
import ContactForm from './All Port/ContactForm';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import BoopLoader from './All Port/BoopLoader';
import Chat from './Chat';

function Portfolio() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile | projects | contact

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists()) {
          setProfileData({ ...docSnap.data(), uid: currentUser.uid });
        }
        setIsLoadingProfile(false);
      }
    });
    return unsubscribe;
  }, [auth]);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleSave = async (updatedData) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedData);
      setProfileData((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => setIsEditing(false);

  if (isLoadingProfile) return <BoopLoader />;
  if (!user) return <div className="text-center mt-10 text-lg text-gray-700 dark:text-gray-300">Please login</div>;

  const publicLink = `${window.location.origin}/view/${user.uid}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === 'contact'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Active Section */}
        <div className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          {activeTab === 'profile' && (
            <ProfileSection
              profileData={profileData}
              publicLink={publicLink}
              copyToClipboard={copyToClipboard}
              copySuccess={copySuccess}
              isEditing={isEditing}
              onEditClick={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {activeTab === 'projects' && <ProjectsSection userId={user.uid} />}
          {activeTab === 'contact' && <ContactForm userId={user.uid} />}
        </div>
      </div>
      <Chat/>
    </div>
  );
}

export default Portfolio;
