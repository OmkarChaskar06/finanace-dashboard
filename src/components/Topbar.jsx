import React, { useEffect, useRef, useState } from 'react';
import { Bell, Search, User, ChevronDown, Menu, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';
import { currentUser } from '../mockData';

const Topbar = ({ onMenuClick, onSearch, searchValue = '' }) => {
  const { role, setRole } = useRole();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const handleRoleToggle = (e) => {
    setRole(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    if (onSearch) {
      onSearch('');
    }
  };

  const closeNotifications = () => {
    setShowNotifications(false);
    setActiveNotification(null);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setActiveNotification(null);
      }

      return nextValue;
    });
  };

  const handleNotificationClick = (notification) => {
    setActiveNotification((currentNotification) =>
      currentNotification?.id === notification.id ? null : notification
    );
    setShowNotifications(true);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
    closeNotifications();
  };

  const handleProfileLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/');
  };

  const notifications = [
    { id: 1, title: 'Payment Received', description: 'Your invoice #345 was paid successfully.', time: '2m ago' },
    { id: 2, title: 'Reminder', description: 'Your monthly budget review is due tomorrow.', time: '1h ago' },
    { id: 3, title: 'Security Alert', description: 'New login from Chrome on Windows.', time: '3h ago' }
  ];

  useEffect(() => {
    if (!showNotifications) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        closeNotifications();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [showNotifications]);

  return (
    <header className="topbar glass-panel">
      <div className="mobile-menu-btn" onClick={onMenuClick}>
        <button className="icon-btn">
          <Menu size={24} />
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search transaction or item name like Apple..." 
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <button type="button" className="search-clear-btn" onClick={clearSearch} title="Clear search">
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="topbar-actions">
        <div className="role-selector">
          <span className="role-label">Role:</span>
          <select value={role} onChange={handleRoleToggle} className="role-dropdown">
            <option value="viewer">Viewer (Read Only)</option>
            <option value="admin">Admin (Full Access)</option>
          </select>
        </div>

        <div className="notification-wrapper" ref={notificationRef}>
          <button type="button" className="icon-btn notification-btn" onClick={toggleNotifications} title="View notifications">
            <Bell size={20} />
            <span className="badge">3</span>
          </button>
          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <span>Notifications</span>
              </div>
              <ul>
                {notifications.map(item => (
                  <li
                    key={item.id}
                    className={`notification-item ${activeNotification?.id === item.id ? 'active' : ''}`}
                    onClick={() => handleNotificationClick(item)}
                  >
                    <div className="notification-title-row">
                      <strong>{item.title}</strong>
                      <span className="notification-time">{item.time}</span>
                    </div>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
              {activeNotification && (
                <div className="notification-detail">
                  <h4>{activeNotification.title}</h4>
                  <p>{activeNotification.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {showProfileMenu && <div className="profile-backdrop" onClick={() => setShowProfileMenu(false)} />}
        <div className="user-profile" onClick={toggleProfileMenu}>
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || currentUser.name}</span>
          </div>
          <ChevronDown size={16} className="chevron" />

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <strong>{user?.name || currentUser.name}</strong>
                <p>{user?.email || currentUser.email}</p>
              </div>
              <button type="button" className="profile-dropdown-item" onClick={handleProfileLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        <button className="logout-icon-btn" onClick={handleLogout} title="Logout Account">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
