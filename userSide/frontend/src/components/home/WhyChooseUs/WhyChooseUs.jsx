import SectionHeader from '../../SectionHeader/SectionHeader';
import { whyChooseUs } from '../../../data/whyChooseUs';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import styles from './WhyChooseUs.module.css';

const icons = {
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22c-4-4-8-8-8-14a8 8 0 0 1 16 0c0 6-4 10-8 14z" />
      <path d="M12 22V10" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22c4-4 6-8 6-12a6 6 0 0 0-12 0c0 4 2 8 6 12z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  ),
};

export default function WhyChooseUs() {
  const gridRef = useScrollReveal();

  return (
    <section className="section" aria-labelledby="why-heading">
      <div className="container">
        <SectionHeader
          label="Our Promise"
          title="Why Choose Us"
          subtitle="Every detail reflects our commitment to premium North Indian hospitality."
        />
        <div ref={gridRef} className={`${styles.grid} reveal-on-scroll`}>
          {whyChooseUs.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.icon}>{icons[item.icon]}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
