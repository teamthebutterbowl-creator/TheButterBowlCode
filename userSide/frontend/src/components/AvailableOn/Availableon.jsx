import styles from './AvailableOn.module.css';


const SWIGGY_URL = 'https://www.swiggy.com/restaurants/your-restaurant-link';
const ZOMATO_URL = 'https://www.zomato.com/your-city/your-restaurant-link';

// Simple check-circle icon (replaces ✅ emoji for a cleaner, consistent look)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#2E7D32" />
    <path d="M7.5 12.5L10.2 15.2L16.5 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Star icon (replaces ⭐ emoji)
const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="#C8902E" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6L12 2z" />
  </svg>
);

// Authentic Swiggy & Zomato logos served via Simple Icons CDN (open-source, CC0 brand icon library)
const SwiggyIcon = () => (
  <img
    src="https://cdn.simpleicons.org/swiggy/white"
    alt="Swiggy"
    className={styles.brandIcon}
  />
);

const ZomatoIcon = () => (
  <img
    src="https://cdn.simpleicons.org/zomato/white"
    alt="Zomato"
    className={styles.brandIcon}
  />
);

export default function AvailableOn() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <CheckIcon />
        <span className={styles.title}>Also Available On</span>
      </div>
      <p className={styles.subtitle}>Order from your favourite platforms</p>

      <div className={styles.buttonRow}>
        <a
          href={SWIGGY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.swiggy}`}
        >
          <SwiggyIcon />
          SWIGGY
        </a>

        <a
          href={ZOMATO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.zomato}`}
        >
          <ZomatoIcon />
          ZOMATO
        </a>
      </div>

      <div className={styles.footer}>
        <StarIcon />
        <span>
          Best offers &amp; exclusive combos on <strong>TheButterBowl.in</strong>
        </span>
      </div>
    </div>
  );
}