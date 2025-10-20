import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
const App = React.lazy(() => import('./App.jsx'));
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from './Context/DarkModeContext'; 
import { ToastProvider } from './Component/UI/ToastContext';
import ErrorBoundary from './Component/UI/ErrorBoundary';
import Splash from './Component/UI/Splash';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <BrowserRouter>
        <ToastProvider>
          <ErrorBoundary>
            <Suspense fallback={<Splash/>}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </ToastProvider>
      </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
);
