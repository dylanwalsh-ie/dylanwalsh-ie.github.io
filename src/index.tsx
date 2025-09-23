/**
 * @file The main entry point for the pprtfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Renders the root react component into the DOM
 */
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Retrieves DOM element where the app will be mounted
// This corresponds to the '<div id=root>' in the index.html file
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Modern way to initialise a react 18 application
const root = ReactDOM.createRoot(rootElement);
root.render(
  // Wrapper to check for potential problems during development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
