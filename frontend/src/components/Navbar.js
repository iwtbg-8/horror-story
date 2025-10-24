import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSkull, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaSkull className="logo-icon" />
          <span className="horror-title">Dark Tales</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/stories" className="nav-link" onClick={() => setMenuOpen(false)}>
            Stories
          </Link>
          <Link to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>
            Categories
          </Link>
          
          {user ? (
            <>
              <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                <FaUserCircle /> Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="nav-btn">Sign Up</button>
              </Link>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
