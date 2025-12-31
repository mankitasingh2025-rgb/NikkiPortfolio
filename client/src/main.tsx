import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { reportWebVitals } from './lib/performance';

// Start performance monitoring
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
