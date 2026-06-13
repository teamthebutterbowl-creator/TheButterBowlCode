import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const classNames = [
    styles.btn,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    if (disabled) {
      return (
        <span className={classNames} aria-disabled="true" {...props}>
          {children}
        </span>
      );
    }
    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    if (disabled) {
      return (
        <span className={classNames} aria-disabled="true" {...props}>
          {children}
        </span>
      );
    }
    return (
      <a href={href} className={classNames} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
