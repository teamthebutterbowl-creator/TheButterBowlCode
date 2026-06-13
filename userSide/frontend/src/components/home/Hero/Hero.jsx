import Button from '../../Button/Button';
import FoodImage from '../../FoodImage/FoodImage';
import { dishImages } from '../../../data/foodPlaceholders';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Welcome">
      <div className={`container ${styles.grid}`}>
        <div className={styles.content}>
          <span className="section-label fade-in">North Indian Cuisine</span>
          <h1 className={`${styles.heading} fade-in fade-in-delay-1`}>
          The Bowl That Melts Hearts
          </h1>
          <p className={`${styles.description} fade-in fade-in-delay-2`}>
            From our kitchen to your heart, we bring authentic North Indian
            flavors rich, warm and timeless.
          </p>
          <div className={`${styles.actions} fade-in fade-in-delay-3`}>
            <Button to="/menu">Explore Menu</Button>
            <Button to="/about" variant="secondary">
              Our Story
            </Button>
          </div>
        </div>

        <div className={`${styles.visual} image-reveal`}>
          <div className={styles.imageFrame}>
            <FoodImage
              src="/Image1.jpeg"
              alt="Premium butter chicken served in an elegant bowl"
              category="Main Course"
              loading="eager"
            />
            <div className={styles.accent} aria-hidden="true" />
          </div>
          <p className={styles.caption}>The Butter Bowl Special</p>
        </div>
      </div>
    </section>
  );
}
