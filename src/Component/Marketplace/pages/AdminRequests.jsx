import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useToast } from '../../UI/ToastContext';

export default function AdminRequests(){
  const [requests, setRequests] = useState([]);

  useEffect(()=>{
    const q = query(collection(db,'job_requests'));
    const unsub = onSnapshot(q, snap=>{
      setRequests(snap.docs.map(d=>({ id: d.id, ...d.data() })))
    });
    return ()=>unsub();
  },[]);

  const toast = useToast();

  const publish = async (req) => {
    // naive publish: copy job -> jobs and delete request
    try{
      await addDoc(collection(db,'jobs'), { ...req.job, postedBy: req.requesterId, posterEmail: req.requesterEmail, createdAt: serverTimestamp() });
      await deleteDoc(doc(db,'job_requests', req.id));
      toast.push('Published', { type: 'info' });
    }catch(e){ console.error(e); toast.push('Failed to publish', { type: 'error' }) }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => window.history.back()} className="text-sm text-indigo-600 hover:underline">← Back</button>
        <h2 className="text-2xl font-semibold">Pending Job Requests</h2>
        <div />
      </div>
      {requests.length === 0 ? <p>No requests</p> : (
        <div className="space-y-4">
          {requests.map(r=> (
            <div key={r.id} className="p-4 border rounded">
              <h3 className="font-semibold">{r.job?.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-600">Requested by: {r.requesterEmail}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={()=>publish(r)} className="px-3 py-1 bg-indigo-600 text-white rounded">Publish</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
