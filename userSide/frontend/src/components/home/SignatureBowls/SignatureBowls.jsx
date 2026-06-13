import { useRef, useState } from 'react';
import SectionHeader from '../../SectionHeader/SectionHeader';
import { signatureBowls } from '../../../data/signatureBowls';
import { formatPrice } from '../../../data/menu';
import FoodImage from '../../FoodImage/FoodImage';
import styles from './SignatureBowls.module.css';

export default function SignatureBowls() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActive(index);
    }
  };

  return (
    <section className={`section ${styles.section}`} aria-labelledby="bowls-heading">
      <div className="container">
        <SectionHeader
          label="Chef's Selection"
          title="Signature Bowls"
          subtitle="Our most celebrated creations — each bowl a masterpiece of North Indian tradition."
        />

        <div className={styles.sliderWrap}>
          <div ref={trackRef} className={styles.track} role="list">
            {signatureBowls.map((bowl) => (
              <article key={bowl.id} className={styles.card} role="listitem">
                <div className={styles.imageWrap}>
                  <FoodImage
                    src={bowl.image}
                    alt={bowl.name}
                    category="Main Course"
                  />
                </div>
                <div className={styles.body}>
                  <h3>{bowl.name}</h3>
                  <p>{bowl.description}</p>
                  <span className={styles.price}>{formatPrice(bowl.price)}</span>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.dots} role="tablist" aria-label="Bowl slides">
            {signatureBowls.map((bowl, i) => (
              <button
                key={bowl.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to ${bowl.name}`}
                className={`${styles.dot} ${active === i ? styles.dotActive : ''}`}
                onClick={() => scrollTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
