import React, { useState } from 'react';

export default function PortfolioSupport({ onAttach }){
  const [link, setLink] = useState('');
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">Portfolio Link (optional)</label>
      <div className="flex gap-2">
        <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://your-portfolio.com" className="flex-1 p-2 rounded" />
        <button onClick={()=>{ onAttach(link); setLink('') }} className="px-3 py-1 bg-indigo-600 text-white rounded">Attach</button>
      </div>
    </div>
  )
}
