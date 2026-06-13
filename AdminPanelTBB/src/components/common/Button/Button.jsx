import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''}`} 
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="btn-icon" />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon className="btn-icon" />}
    </button>
  );
};

export default Button;
