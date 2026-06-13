/**
 * Reusable section heading block — label, title, optional subtitle.
 */
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './SectionHeader.module.css';

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  light = false,
}) {
  const ref = useScrollReveal();

  return (
    <header
      ref={ref}
      className={`${styles.header} ${styles[align]} reveal-on-scroll ${light ? styles.light : ''}`}
    >
      {label && <span className="section-label">{label}</span>}
      {title && <h2 className={`section-title ${styles.title}`}>{title}</h2>}
      {subtitle && <p className={`section-subtitle ${styles.subtitle}`}>{subtitle}</p>}
    </header>
  );
}
