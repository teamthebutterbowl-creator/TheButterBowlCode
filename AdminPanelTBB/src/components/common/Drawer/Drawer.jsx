import React from 'react';
import './Drawer.css';

const Drawer = ({ open, title, children, onClose }) => {
  return (
    <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="drawer-panel" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} className="drawer-close">
            ×
          </button>
        </div>
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
