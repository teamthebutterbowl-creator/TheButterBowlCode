import { Link } from 'react-router-dom';
import logoSrc from '../../assets/TBBLOGO2.png';
import styles from './Logo.module.css';

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className={styles.logo} aria-label="The Butter Bowl — Home">
      <img
        src={logoSrc}
        alt="The Butter Bowl"
        className={compact ? styles.compact : styles.full}
      />
    </Link>
  );
}
