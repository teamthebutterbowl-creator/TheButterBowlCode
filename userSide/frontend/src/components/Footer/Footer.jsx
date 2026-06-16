import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import { brand, navLinks } from '../../data/brand';
import styles from './Footer.module.css';

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={styles.socialLink}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Logo />
          <p className={styles.tagline}>{brand.tagline}</p>
          <p className={styles.cuisine}>{brand.cuisine}</p>
          <div className={styles.social}>
            <SocialIcon href={brand.social.instagram} label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </SocialIcon>

            <SocialIcon href={brand.social.whatsapp} label="WhatsApp">
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.14 1.59 5.95L0 24l6.37-1.67a11.83 11.83 0 0 0 5.67 1.45h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.15-3.39-8.44zM12.05 21.7a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.77 9.77 0 0 1-1.5-5.19c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.96 2.89a9.77 9.77 0 0 1 2.88 6.95c0 5.43-4.41 9.83-9.83 9.83zm5.39-7.37c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.44.13-.58.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.37-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.57-.48-.49-.65-.5h-.56c-.19 0-.49.07-.75.37-.26.29-.98.96-.98 2.34s1.01 2.71 1.15 2.9c.15.19 1.98 3.03 4.79 4.25.67.29 1.2.46 1.61.59.68.22 1.29.19 1.78.12.54-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/>
  </svg>
</SocialIcon>
            {/* <SocialIcon href={brand.social.facebook} label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </SocialIcon> */}
            {/* <SocialIcon href={brand.social.twitter} label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l16 16M20 4L4 20" />
              </svg>
            </SocialIcon> */}
          </div>
        </div>

        <div>
          <h3 className={styles.colTitle}>Quick Links</h3>
          <ul className={styles.linkList}>
            {navLinks.map(({ label, path }) => (
              <li key={path}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
            <li>
              <Link to="/order">Order Online</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.colTitle}>Opening Hours</h3>
          <ul className={styles.hoursList}>
            <li>
              <span>Mon – Sun
              </span>
              <br/>
              <span>{brand.hours.weekdays}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.colTitle}>Contact</h3>
          <address className={styles.contact}>
            <p>{brand.address}</p>
            <a href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>
            &copy; {year} {brand.displayName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
