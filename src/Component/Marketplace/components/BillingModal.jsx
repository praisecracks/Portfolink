import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useToast } from '../../UI/ToastContext';

export default function BillingModal({ open, onClose, jobPayload, user }) {
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const toast = useToast();

  const handlePay = async () => {
    setProcessing(true);
    try {
      // Simulate payment: write a job_requests document with status 'paid'
      await addDoc(collection(db, 'job_requests'), {
        job: jobPayload,
        requesterId: user?.uid || null,
        requesterEmail: user?.email || null,
        amount: jobPayload.amount || 10,
        status: 'paid',
        createdAt: serverTimestamp(),
      });
      toast.push('Payment simulated and job request submitted. An admin will review and publish.', { type: 'info' });
      onClose(true);
    } catch (err) {
      console.error('Billing error', err);
      toast.push('Payment failed (simulated).', { type: 'error' });
      onClose(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Pay to Post Job</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">This simulated payment will create a job request for admin review. Amount: ${jobPayload.amount || 10}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => onClose(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
          <button onClick={handlePay} disabled={processing} className="px-4 py-2 rounded bg-indigo-600 text-white">{processing ? 'Processing...' : 'Pay & Submit'}</button>
        </div>
      </div>
    </div>
  );
}
