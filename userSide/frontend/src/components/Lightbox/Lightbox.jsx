import { useEffect } from 'react';
import FoodImage from '../FoodImage/FoodImage';
import styles from './Lightbox.module.css';

export default function Lightbox({ item, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev?.();
      if (e.key === 'ArrowRight') onNext?.();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
        {onPrev && (
          <button type="button" className={styles.prev} onClick={onPrev} aria-label="Previous">
            ‹
          </button>
        )}
        <FoodImage
          src={item.image}
          alt={item.title}
          category={item.category === 'Food' ? 'Main Course' : undefined}
          loading="eager"
          className={styles.lightboxImg}
        />
        <p className={styles.caption}>{item.title}</p>
        {onNext && (
          <button type="button" className={styles.next} onClick={onNext} aria-label="Next">
            ›
          </button>
        )}
      </div>
    </div>
  );
}
