import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '../UI/ToastContext';

export default function Settings(){
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async ()=>{
    try{
      await signOut(auth);
      toast.push('Logged out', { type: 'info' });
      navigate('/login');
    }catch(e){
      console.error(e);
      toast.push('Logout failed', { type: 'error' });
    }
  }

  const handleDeleteAccount = async ()=>{
    const ok = window.confirm('Delete account? This action is permanent. Are you sure?');
    if(!ok) return;
    try{
      const user = auth.currentUser;
      if(!user) return navigate('/login');
      // best-effort: delete user doc and sign out. Deleting Auth user requires recent login and may fail.
      await deleteDoc(doc(db,'users', user.uid));
      try{ await user.delete(); }catch(err){ console.warn('Auth delete failed - requires reauth:', err); }
      toast.push('Account removed (Firestore doc deleted). Please sign out if still signed in.', { type: 'info' });
      navigate('/');
    }catch(e){ console.error(e); toast.push('Failed to remove account', { type: 'error' }); }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h3 className="font-medium mb-2">Account</h3>
        <div className="flex gap-3">
          <button onClick={handleLogout} className="px-4 py-2 bg-indigo-600 text-white rounded">Logout</button>
          <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded">Delete Account</button>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-medium mb-2">Preferences</h3>
        <p className="text-sm text-gray-500">More settings coming soon: subscription management, notification preferences, linked accounts.</p>
      </section>
    </div>
  )
}
