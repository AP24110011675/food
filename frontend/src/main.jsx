import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

window.onerror = function(message, source, lineno, colno, error) {
  console.error('GLOBAL ERROR:', message, 'at', source, lineno, colno, error);
};

window.onunhandledrejection = function(event) {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
};

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } else {
    console.error('ROOT ELEMENT NOT FOUND');
  }
} catch (error) {
  console.error('RENDER CRASHED:', error);
}
