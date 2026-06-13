import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ tabs, onChange }) => {
  const [active, setActive] = useState(tabs[0]?.key || 'general');

  const handleTab = (key) => {
    setActive(key);
    if (onChange) onChange(key);
  };

  return (
    <div className="tabs-wrapper">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tabs-button ${active === tab.key ? 'active' : ''}`}
            type="button"
            onClick={() => handleTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
