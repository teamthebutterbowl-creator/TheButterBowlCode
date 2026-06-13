import React, { useState } from 'react';
import './TextArea.css';

const TextArea = ({ label, value, onChange, placeholder, rows = 4, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="textarea-wrapper">
      {label && <label className="textarea-label">{label}</label>}
      <div className={`textarea-field ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <textarea 
          rows={rows} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default TextArea;
