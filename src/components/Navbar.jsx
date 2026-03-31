import React from 'react';
import { NavLink } from 'react-router-dom';
import { Lightbulb, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <div>
            <NavLink to="/" className="nav-brand">
              <Lightbulb size={24} />
              <span>Startup Builder</span>
            </NavLink>
          </div>
          
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Explore</NavLink>
            <NavLink to="/generate" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Generate</NavLink>
            <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Favorites</NavLink>
          </div>
          
          <div className="mobile-menu-btn">
            <button aria-label="Menu" style={{ padding: '0.5rem' }}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
