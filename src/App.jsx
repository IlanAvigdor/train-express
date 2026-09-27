import React, { useState, useEffect } from 'react';
import Wizard from './components/Wizard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath === '/admin') {
    return (
      <div className="app-container">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Wizard />
    </div>
  );
}

export default App;
