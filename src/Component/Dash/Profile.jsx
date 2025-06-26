import React, { useEffect, useState, useRef } from "react";
import { FiCamera } from 'react-icons/fi';
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import { uploadImageToBackend } from '../uploadImageToBackend'; // adjust the path based on where you place the file
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import { toast } from "react-toastify";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    quote: "",
    skills: "",
    photoURL: ""
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
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
          toast.info("Profile not found.");
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
          email: currentUser.email,
          photoURL: data.photoURL || currentUser.photoURL || "",
          joinedAt: currentUser.metadata?.creationTime,
          role
        });

        setEditForm({
          fullName: data.fullName || "",
          quote: data.quote || "",
          skills: (data.skills || []).join(", "),
          photoURL: data.photoURL || ""
        });

        setProjectCount(projectSnap.size);
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Failed to load profile data");
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
      toast.success("Image uploaded!");
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    toast.error("Image upload failed");
  } finally {
    setUploading(false);
  }
};


  const handleSave = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      const updatedData = {
        ...editForm,
        skills: editForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      };

      await setDoc(doc(db, "users", currentUser.uid), updatedData, { merge: true });

      toast.success("Profile updated!");
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile.");
    }
  };

  const handleDeletePhoto = () => {
    setEditForm((prev) => ({ ...prev, photoURL: "" }));
    toast.info("Photo will be removed when you save changes.");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Fetching profile data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No profile data found. Please update your profile.
      </p>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full h-40 bg-indigo-600 relative group">
        <div
          className="absolute left-6 -bottom-14 w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg group-hover:opacity-90 transition cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={
              userData.photoURL?.trim()
                ? userData.photoURL
                : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <FiCamera className="text-white text-xl" />
          </div>
        </div>
      </div>

      <div className="pt-20 px-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {userData.fullName || "Unnamed User"}
            </h1>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-sm text-gray-400">
              Joined {userData.joinedAt ? moment(userData.joinedAt).format("MMMM D, YYYY") : "Unknown"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm mt-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Role:</p>
            <p className="text-lg font-semibold text-indigo-600">{userData.role}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Skills:</p>
            <p className="text-base text-gray-700">{(userData.skills || []).join(", ") || "Not added"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Quote / Status:</p>
            <p className="text-base italic text-gray-600">{userData.quote || "“No quote added yet.”"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Projects Uploaded:</p>
            <p className="text-lg font-semibold text-gray-800">{projectCount}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Badges:</p>
            <div className="flex gap-2 mt-1">
              <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">Beginner</span>
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={editForm.fullName}
              onChange={handleEditChange}
              className="w-full border rounded px-4 py-2 mb-3"
            />

            <textarea
              name="quote"
              placeholder="Personal Quote or Status"
              value={editForm.quote}
              onChange={handleEditChange}
              className="w-full border rounded px-4 py-2 mb-3"
            />

            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={editForm.skills}
              onChange={handleEditChange}
              className="w-full border rounded px-4 py-2 mb-3"
            />

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handlePhotoUpload(e.target.files[0])}
              accept="image/*"
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 mb-3"
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
                  className="text-xs text-red-600 underline"
                >
                  Remove Photo
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
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

export default Profile;
