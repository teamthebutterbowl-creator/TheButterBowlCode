import { useState, useMemo } from 'react';
import FilterBar from '../../components/FilterBar/FilterBar';
import Lightbox from '../../components/Lightbox/Lightbox';
import FoodImage from '../../components/FoodImage/FoodImage';
import { galleryCategories, galleryItems } from '../../data/gallery';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(
    () =>
      category === 'All'
        ? galleryItems
        : galleryItems.filter((item) => item.category === category),
    [category]
  );

  const lightboxItem =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Visual Journey</span>
          <h1>Gallery</h1>
          <p>
            A glimpse into our kitchen, dining spaces, celebrations, and the art
            on every plate.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <FilterBar
            categories={galleryCategories}
            active={category}
            onChange={(cat) => {
              setCategory(cat);
              setLightboxIndex(null);
            }}
          />
          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.item} ${item.tall ? styles.tall : ''}`}
                onClick={() => setLightboxIndex(i)}
              >
                <FoodImage
                  src={item.image}
                  alt={item.title}
                  category={item.category === 'Food' ? 'Main Course' : undefined}
                />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        item={lightboxItem}
        onClose={() => setLightboxIndex(null)}
        onPrev={
          lightboxIndex > 0
            ? () => setLightboxIndex((i) => i - 1)
            : undefined
        }
        onNext={
          lightboxIndex < filtered.length - 1
            ? () => setLightboxIndex((i) => i + 1)
            : undefined
        }
      />
    </>
  );
}
