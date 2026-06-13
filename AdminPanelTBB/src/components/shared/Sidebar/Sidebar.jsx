import React from 'react';
import { NavLink } from 'react-router-dom';
import {useNavigate} from  'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingCart, 
  BadgePercent, 
  LayoutTemplate, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { logoutAdmin } from '../../../utils/auth.js';
import './Sidebar.css';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Offers', path: '/offers', icon: BadgePercent },
 
  { name: 'Settings', path: '/settings', icon: Settings }
];


const Sidebar = ({ collapsed, open, onToggle, onClose }) => {
  const navigate=useNavigate();
  function logoutHandler(){
    localStorage.removeItem("token"); //clear auth token 
    localStorage.removeItem("user");
    navigate("/login");
  }
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">tbb</div>
        {!collapsed && (
          <div className="sidebar-title">
            <span>the butter bowl</span>
            <strong>Admin Panel</strong>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              title={collapsed ? item.name : ''}
            >
              <Icon className="sidebar-icon" size={20} />
              {!collapsed && <span className="sidebar-label">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" type="button" title="Logout" onClick={logoutHandler}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
        <button 
          className="sidebar-collapse" 
          type="button" 
          onClick={onToggle}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

