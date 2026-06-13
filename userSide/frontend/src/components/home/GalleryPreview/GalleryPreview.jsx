import { Link } from 'react-router-dom';
import SectionHeader from '../../SectionHeader/SectionHeader';
import { galleryItems } from '../../../data/gallery';
import FoodImage from '../../FoodImage/FoodImage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import styles from './GalleryPreview.module.css';

const previewItems = galleryItems.slice(0, 6);

export default function GalleryPreview() {
  const ref = useScrollReveal();

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          label="Visual Journey"
          title="Moments at The Butter Bowl"
          subtitle="Food, interiors, kitchen artistry, and celebrations."
        />
        <div ref={ref} className={`${styles.masonry} reveal-on-scroll`}>
          {previewItems.map((item, i) => (
            <figure
              key={item.id}
              className={`${styles.item} ${item.tall ? styles.tall : ''} ${styles[`pos${i}`]}`}
            >
              <FoodImage
                src={item.image}
                alt={item.title}
                category={item.category === 'Food' ? 'Main Course' : undefined}
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
        <div className={styles.cta}>
          <Link to="/gallery" className={styles.viewBtn}>
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
