import React, { useState } from 'react';
import './FormInput.css';

const FormInput = ({ label, value, onChange, placeholder, type = 'text', error, icon: Icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="form-input-wrapper">
      {label && <label className="form-input-label">{label}</label>}
      <div className={`form-input-field ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        {Icon && <Icon className="input-icon" />}
        <input 
          type={type} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props} 
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default FormInput;
