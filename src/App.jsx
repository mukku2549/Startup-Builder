import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Generate from './pages/Generate';
import Favorites from './pages/Favorites';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      
      {/* Toast notifications container */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            fontWeight: 500,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            border: '1px solid #E2E8F0',
            background: 'white',
            color: '#0F172A',
          },
          success: {
            iconTheme: {
              primary: '#6366F1',
              secondary: 'white',
            },
          },
        }} 
      />
    </div>
  );
}

export default App;
