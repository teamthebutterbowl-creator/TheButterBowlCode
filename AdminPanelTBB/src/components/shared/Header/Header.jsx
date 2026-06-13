import React, { useState, useEffect, useRef  } from 'react';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Header.css';


const getAdminName = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return 'Admin';

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser && typeof parsedUser === 'object') {
      return (
        parsedUser.name ||
        parsedUser.username ||
        parsedUser.fullName ||
        parsedUser.email ||
        parsedUser.adminName ||
        'Admin'
      );
    }
    return storedUser;
  } catch (e) {
    return 'Admin';
  }
};

const Header = ({ onToggleSidebar, onCollapseSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminName, setAdminName] = useState(getAdminName());
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Re-read admin name whenever localStorage 'user' changes (same tab or other tabs)
  useEffect(() => {
    const refreshName = () => setAdminName(getAdminName());

    window.addEventListener('user-updated', refreshName);
    window.addEventListener('storage', refreshName);

    return () => {
      window.removeEventListener('user-updated', refreshName);
      window.removeEventListener('storage', refreshName);
    };
  }, []);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
  
    socketRef.current.on('new-order', (data) => {
      // Browser notification
  if (Notification.permission === 'granted') {
    new Notification('🛎️ New Order Received!', {
      body: `Order from ${data.order?.customerDetails?.name || 'Customer'} — ₹${data.order?.totalAmount}`,
      icon: '/favicon.ico',
    });
  }
       // Bell icon update
  setNotifications((prev) => [
    {
      id: Date.now(),
      message: `New order from ${data.order?.customerDetails?.name || 'Customer'}`,
      orderId: data.order?._id,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    },
    ...prev,
  ]);
});
  
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // 2. Initials nikalna (e.g., "Amit Sharma" -> "AS")
  const adminInitials = adminName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="header-hamburger" type="button" onClick={onToggleSidebar} title="Toggle sidebar">
          <span />
          <span />
          <span />
        </button>
        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input 
            type="search" 
            placeholder="Search orders, menu, invoices..." 
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
      <div style={{ position: 'relative' }}>
  <button
    className="icon-button notification-button"
    type="button"
    title="Notifications"
    onClick={() => setShowNotifications(!showNotifications)}
  >
    <Bell size={20} />
    {notifications.filter((n) => !n.read).length > 0 && (
      <span className="notification-badge">
        {notifications.filter((n) => !n.read).length}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="notification-dropdown">
      <div className="notification-header">
        <span>Notifications</span>
        {notifications.length > 0 && (
          <button
            className="notification-clear"
            onClick={() => setNotifications([])}
          >
            Clear all
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="notification-empty">No new notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-item ${n.read ? '' : 'unread'}`}
            onClick={() => {
              setNotifications((prev) =>
                prev.map((item) =>
                  item.id === n.id ? { ...item, read: true } : item
                )
              );
              setShowNotifications(false);
              navigate('/orders');
            }}
          >
            <p className="notification-msg">{n.message}</p>
            <span className="notification-time">{n.time}</span>
          </div>
        ))
      )}
    </div>
  )}
</div>

        <div className="profile-menu-container">
          <button 
            className="profile-button" 
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Profile menu"
          >
            <div className="profile-avatar">{adminInitials}</div>
            <div className="profile-meta">
              <span className="profile-name">{adminName}</span>
              <span className="profile-role">Admin</span>
            </div>
           
          </button>

        
        </div>
      </div>
    </header>
  );
};

export default Header;