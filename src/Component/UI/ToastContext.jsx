import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast(){
  return useContext(ToastContext);
}

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, opts={type:'info', duration:4000})=>{
    const id = Date.now() + Math.random();
    setToasts(t=>[...t, { id, message, ...opts }]);
    if(opts.duration !== 0){
      setTimeout(()=> setToasts(t=>t.filter(x=>x.id!==id)), opts.duration);
    }
  }, []);

  const remove = useCallback((id)=> setToasts(t=>t.filter(x=>x.id!==id)), []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(toast=> (
          <div key={toast.id} className={`px-4 py-2 rounded shadow-lg text-sm ${toast.type==='error'? 'bg-red-600 text-white':'bg-indigo-600 text-white'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
