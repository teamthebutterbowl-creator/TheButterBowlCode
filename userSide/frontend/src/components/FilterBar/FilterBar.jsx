import styles from './FilterBar.module.css';

export default function FilterBar({ categories, active, onChange }) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Filter categories">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={active === cat}
          className={`${styles.btn} ${active === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
