/**
 * Our Story preview — image + narrative with link to full about page.
 * Mobile: stacked (image then text). Desktop: two columns.
 */
import Button from '../../Button/Button';
import FoodImage from '../../FoodImage/FoodImage';
import { dishImages } from '../../../data/foodPlaceholders';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import styles from './StoryPreview.module.css';

export default function StoryPreview() {
  const sectionRef = useScrollReveal();

  return (
    <section className="section" aria-labelledby="story-heading">
      <div className={`container ${styles.grid} reveal-on-scroll`} ref={sectionRef}>
        <div className={styles.imageCol}>
          <FoodImage
            src={dishImages['restaurant-interior']}
            alt="Warm, elegant dining room at The Butter Bowl"
            category="Our Restaurant"
          />
        </div>
        <div className={styles.content}>
          <span className="section-label">Our Heritage</span>
          <h2 id="story-heading" className="section-title">
            A Story Cooked With Passion
          </h2>
          <p className={styles.text}>
            Authentic recipes inspired by generations of North Indian cooking
            traditions. Every dish carries the warmth of home.
          </p>
          <Button to="/about" variant="goldOutline">
            Read Full Story
          </Button>
        </div>
      </div>
    </section>
  );
}
