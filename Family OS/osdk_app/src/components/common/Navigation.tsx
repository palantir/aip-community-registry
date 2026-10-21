import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { selectedUser } = useAppContext();
  
  return (
    <nav className="navigation">
      <div className="logo">
        <span>Family OS</span>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          Dashboard
        </Link>
        <Link 
          to="/food-planner" 
          className={location.pathname === '/food-planner' ? 'active' : ''}
        >
          Food Planner
        </Link>
        <Link 
          to="/profile" 
          className={location.pathname === '/profile' ? 'active' : ''}
        >
          My Profile
        </Link>
      </div>
      
      {selectedUser && (
        <div className="user-nav">
          <span>{selectedUser.firstName}</span>
          <Link to="/" className="logout">
            Log Out
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;