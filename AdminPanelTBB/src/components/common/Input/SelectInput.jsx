import React, { useState } from 'react';
import './SelectInput.css';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({ label, value, onChange, options, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="select-input-wrapper">
      {label && <label className="select-input-label">{label}</label>}
      <div className={`select-input-field ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select-icon" />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default SelectInput;
