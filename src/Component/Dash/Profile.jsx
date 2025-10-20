import React, { useEffect, useState, useRef } from "react";
import { FiCamera } from "react-icons/fi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { uploadImageToBackend } from "../uploadImageToBackend";
import { increment, updateDoc } from "firebase/firestore"; 
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import { useToast } from '../UI/ToastContext';

function Profile() {
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [editForm, setEditForm] = useState({
  fullName: "",
  country: "",
  quote: "",
  skills: "",
  photoURL: "",
  isPublic: true, 
});

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const ADMIN_UID = "msLzg2LxX7Rd3WKVwaqmhWl9KUk2";
  

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          toast.push("Profile not found.", { type: 'info' });
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        const role = currentUser.uid === ADMIN_UID ? "Admin" : "User";

        const projectQuery = query(
          collection(db, "projects"),
          where("userId", "==", currentUser.uid)
        );
        const projectSnap = await getDocs(projectQuery);

      setUserData({
        ...data,
        uid: currentUser.uid,
        email: currentUser.email,
        photoURL: data.photoURL || currentUser.photoURL || "",
        bannerURL: data.bannerURL || '',
        joinedAt: currentUser.metadata?.creationTime,
        role,
        views: typeof data.views === 'number' ? data.views : 0, 
      });

      setEditForm({
        fullName: data.fullName || "",
        country: data.country || "",
        quote: data.quote || "",
        skills: (data.skills || []).join(", "),
        photoURL: data.photoURL || "",
        isPublic: data.isPublic !== false, // 👈 default to true if missing
        bannerURL: data.bannerURL || '',
      });

        setProjectCount(projectSnap.size);
      } catch (error) {
        console.error("Error loading profile data:", error);
  toast.push("Failed to load profile data", { type: 'error' });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (file) => {
    try {
      setUploading(true);
      const imageUrl = await uploadImageToBackend(file);
        if (imageUrl) {
        setEditForm((prev) => ({ ...prev, photoURL: imageUrl }));
        toast.push("Image uploaded!", { type: 'info' });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (file) => {
    try {
      setUploading(true);
      const url = await uploadImageToBackend(file);
      if(url){
        setEditForm((p)=> ({ ...p, bannerURL: url }));
        setUserData((prev)=> ({ ...prev, bannerURL: url }));
        // persist
        const auth = getAuth();
        const currentUser = auth.currentUser;
        await setDoc(doc(db,'users', currentUser.uid), { bannerURL: url }, { merge: true });
        toast.push('Banner updated', { type: 'info' });
      }
    }catch(err){ console.error(err); toast.push('Banner upload failed', { type: 'error' }); }
    finally{ setUploading(false); }
  }

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      const updatedData = {
        ...editForm,
        skills: editForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        isPublic: !!editForm.isPublic, 
      };



      await setDoc(doc(db, "users", currentUser.uid), updatedData, {
        merge: true,
      });

  toast.push("Profile updated!", { type: 'info' });
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
  toast.push("Failed to save profile.", { type: 'error' });
    }
  };

  const handleDeletePhoto = () => {
  setEditForm((prev) => ({ ...prev, photoURL: "" }));
  toast.push("Photo will be removed when you save changes.", { type: 'info' });
  };


  useEffect(() => {
  const auth = getAuth();
  const incrementViews = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userData?.uid) {
      try {
        const userDocRef = doc(db, "users", userData.uid);
        await updateDoc(userDocRef, { views: increment(1) });
      } catch (err) {
        console.error("Failed to increment views:", err);
      }
    }
  };

  if (userData?.uid) {
    incrementViews();
  }
}, [userData]);



  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 dark:text-gray-300">Fetching profile data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
        No profile data found. Please update your profile.
      </p>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="w-full h-48 relative">
        {userData.bannerURL ? (
          <img src={userData.bannerURL} alt="banner" className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-indigo-600 to-purple-600" />
        )}
        <div className="absolute right-4 top-4">
          <label className="cursor-pointer px-3 py-1 bg-white/80 dark:bg-black/60 rounded text-sm">
            Edit Banner
            <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={(e)=>{ const f = e.target.files?.[0]; if(f) handleBannerUpload(f); }} />
          </label>
        </div>
      
        <div className="absolute left-6 -bottom-16 w-28 h-28 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-lg group-hover:opacity-90 transition cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={
              userData.photoURL?.trim()
                ? userData.photoURL
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <FiCamera className="text-white text-xl" />
          </div>
        </div>
        <div className="absolute right-6 -bottom-6 flex gap-2">
          {userData.subscription ? <span className="px-3 py-1 bg-green-600 text-white rounded">Subscribed</span> : <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Free</span>}
          {userData.isRecruiter && <span className="px-3 py-1 bg-indigo-600 text-white rounded">Recruiter</span>}
        </div>
      </div>

      <div className="pt-20 px-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{userData.fullName || "Unnamed User"}</h1>
            <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
            <p className="text-sm text-gray-400">
              Joined {userData.joinedAt ? moment(userData.joinedAt).format("MMMM D, YYYY") : "Unknown"}
            </p>

          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
          >
            Edit Profile
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm space-y-4">
          <Info label="Country" value={userData.country || "Not specified"} />
          <Info label="Role" value={userData.role} className="text-indigo-600 dark:text-indigo-400 font-semibold" />
          <Info label="Skills" value={(userData.skills || []).join(", ") || "Not added"} />
          <Info label="Quote / Status" value={userData.quote || "“No quote added yet.”"} italic />
          <Info label="Projects Uploaded" value={projectCount} className="font-semibold" />
                  {typeof userData.views === 'number' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            👁️ {userData.views} {userData.views === 1 ? 'view' : 'views'}
          </p>
        )}

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Badges:</p>
            <div className="flex gap-2 mt-1">
              <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">Beginner</span>
              {projectCount > 4 && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Contributor</span>
              )}
              {userData.role === "Admin" && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Admin</span>
              )}
            </div>
          </div>

<div className="mb-4">
  <label htmlFor="publicToggle" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-between items-center mb-1">
    <span>Make portfolio public</span>
<div
  className={`w-11 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition-all duration-300 ${
    editForm.isPublic ? "bg-indigo-500" : "bg-gray-400"
  }`}
  onClick={async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const newValue = !editForm.isPublic;

    setEditForm((prev) => ({ ...prev, isPublic: newValue }));

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        isPublic: newValue,
      });

      toast.success(
        `Portfolio is now ${newValue ? "public" : "private"}.`
      );

      setUserData((prev) => ({ ...prev, isPublic: newValue }));
    } catch (err) {
      console.error("Failed to update isPublic:", err);
      toast.error("Failed to update visibility.");
    }
  }}
>
  <div
    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
      editForm.isPublic ? "translate-x-5" : "translate-x-0"
    }`}
  ></div>
</div>

  </label>
<p className="text-xs text-gray-500 dark:text-gray-400">
  {editForm.isPublic
    ? "You have selected to make your portfolio public. Click 'Save Changes' to apply."
    : "You have selected to keep your portfolio private. Click 'Save Changes' to apply."}
</p>
<p className="text-xs text-gray-500 dark:text-gray-400">
  {userData.isPublic
    ? "Your portfolio is currently visible to the public."
    : "Your portfolio is private and not visible to others."}
</p>

</div>


        </div>
      </div>



      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 text-gray-800 dark:text-gray-100">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            {["fullName", "country", "quote", "skills"].map((field) => (
              <input
                key={field}
                type={field === "quote" ? "textarea" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={editForm[field]}
                onChange={handleEditChange}
                className="w-full border dark:border-gray-600 dark:bg-gray-900 rounded px-4 py-2 mb-3"
              />
            ))}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handlePhotoUpload(e.target.files[0])}
              accept="image/*"
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 mb-3 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload New Photo"}
            </button>

            {editForm.photoURL && (
              <div className="flex justify-between items-center mb-3">
                <img
                  src={editForm.photoURL}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-full"
                />
                <button
                  onClick={handleDeletePhoto}
                  className="text-xs text-red-600 dark:text-red-400 underline"
                >
                  Remove Photo
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 dark:hover:bg-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value, className = "", italic = false }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}:</p>
    <p className={`text-base ${className} ${italic ? "italic" : ""}`}>{value}</p>
  </div>
);

export default Profile;
