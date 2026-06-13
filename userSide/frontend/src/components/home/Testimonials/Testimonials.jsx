import { useState } from 'react';
import SectionHeader from '../../SectionHeader/SectionHeader';
import { testimonials } from '../../../data/testimonials';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const go = (dir) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  return (
    <section className="section" aria-label="Guest reviews">
      <div className="container">
        <SectionHeader
          label="Guest Experiences"
          title="What Our Guests Say"
        />

        <div className={styles.carousel}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(-1)}
            aria-label="Previous review"
          >
            ‹
          </button>

          <blockquote key={current.id} className={styles.card}>
            <div className={styles.stars} aria-hidden="true">
              {'★'.repeat(current.rating)}
            </div>
            <p className={styles.quote}>&ldquo;{current.quote}&rdquo;</p>
            <footer>
              <cite className={styles.name}>{current.name}</cite>
              <span className={styles.role}>{current.role}</span>
            </footer>
          </blockquote>

          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(1)}
            aria-label="Next review"
          >
            ›
          </button>
        </div>

        <div className={styles.indicators}>
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Review ${i + 1}`}
              aria-current={i === index}
              className={`${styles.indicator} ${i === index ? styles.active : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
