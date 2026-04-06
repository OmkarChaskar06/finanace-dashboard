import React from 'react';
import { Home, PieChart, Activity, Settings, CreditCard, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const { role } = useRole();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'Dashboard', icon: Home },
    { id: 'Transactions', icon: Activity },
    { id: 'Analytics', icon: PieChart },
    { id: 'Cards', icon: CreditCard }
  ];

  if (isAdmin) {
    navItems.push({ id: 'Admin Settings', icon: Settings });
  }

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    if (isOpen) {
      onClose(); // Automatically close mobile drawer
    }
  };

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon" aria-hidden="true">
          <span className="logo-ring"></span>
          <span className="logo-bar logo-bar-one"></span>
          <span className="logo-bar logo-bar-two"></span>
          <span className="logo-bar logo-bar-three"></span>
          <span className="logo-pulse"></span>
        </div>
        <div className="logo-copy">
          <h2>FinPulse</h2>
          <p>Smart finance flow</p>
        </div>
        <button className="icon-btn mobile-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => (
            <li 
              key={item.id} 
              className={activeTab === item.id ? 'active' : ''}
              onClick={() => handleTabClick(item.id)}
            >
              <item.icon size={20} />
              <span>{item.id}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
