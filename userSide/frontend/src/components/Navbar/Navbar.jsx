import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import { useCart } from '../../context/CartContext';
import { navLinks } from '../../data/brand';
import styles from './Navbar.module.css';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={`container ${styles.inner}`}>
        <Logo compact={scrolled} />

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navLinks.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              end={path === '/'}
            >
              {label === 'Our Story' ? 'OUR STORY' : label.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            to="/order"
            className={styles.cartBtn}
            aria-label={`Cart, ${itemCount} items`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
            {itemCount > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
  <div className={styles.userMenu}>
    <Link to="/profile" className={styles.userName}>
      👤 {user?.name}
    </Link>
    <button onClick={logout} className={styles.logoutBtn}>
      Logout
    </button>
  </div>
) : (
  <Button to="/auth" size="sm" className={styles.authBtn}>
    Login / Register
  </Button>
)}

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={menuOpen ? styles.open : ''} />
          </button>
        </div>
      </div>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}
        aria-hidden={!menuOpen}
      >

        <nav aria-label="Mobile navigation">
          {navLinks.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.active : ''}`
              }
              end={path === '/'}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/order" className={styles.mobileCart} onClick={() => setMenuOpen(false)}>
  Cart {itemCount > 0 && `(${itemCount})`}
</Link>

{isLoggedIn ? (
  <>
    <Link to="/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
      👤 My Profile
    </Link>
    <button
      className={styles.mobileLogout}
      onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
    >
      Logout
    </button>
  </>
) : (
  <Button
    to="/auth"
    variant="primary"
    className={styles.mobileAuth}
    onClick={() => setMenuOpen(false)}
  >
    Login / Register
  </Button>
)}
        </nav>
      </div>
    </header>
  );
}

