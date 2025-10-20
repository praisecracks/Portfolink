import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db, auth } from '../../../firebase';
import PortfolioSupport from './PortfolioSupport';
import { useToast } from '../../UI/ToastContext';

export default function ApplyForm({ jobId }) {
  const [cover, setCover] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const toast = useToast();
    if (!user) { toast.push('Please sign in to apply', { type: 'error' }); return; }
    setLoading(true);
    try {
      let resumeUrl = null;
      if (file) {
        const storageRef = ref(storage, `resumes/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, () => resolve());
        });
        resumeUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, `jobs/${jobId}/applications`), {
        applicantId: user.uid,
        applicantEmail: user.email || null,
        jobId,
        coverLetter: cover || null,
        resumeUrl: resumeUrl || null,
        portfolioLink: portfolioLink || null,
        status: 'submitted',
        createdAt: serverTimestamp(),
      });

      toast.push('Application submitted. Good luck!', { type: 'info' });
      setCover(''); setFile(null); setPortfolioLink(null);
    } catch (err) {
      console.error('Apply error', err);
      toast.push('Failed to apply: ' + (err?.message || err), { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Cover Letter</label>
        <textarea value={cover} onChange={(e)=>setCover(e.target.value)} className="mt-1 w-full p-2 rounded" rows={4} />
      </div>
      <div>
        <label className="block text-sm font-medium">Upload Resume (pdf/docx)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="mt-1" />
      </div>

      <PortfolioSupport onAttach={setPortfolioLink} />
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading? 'Applying...' : 'Apply'}</button>
      </div>
    </form>
  );
}
