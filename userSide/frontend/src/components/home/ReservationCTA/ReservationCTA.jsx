import Button from '../../Button/Button';
import styles from './ReservationCTA.module.css';

export default function ReservationCTA() {
  return (
    <section className={styles.cta} aria-labelledby="reserve-heading">
      <div className={`container ${styles.inner}`}>
        <span className={styles.label}>Fine Dining Experience</span>
        <h2 id="reserve-heading">Reserve Your Table</h2>
        <p>
          Join us for an evening of warmth, flavour, and impeccable hospitality.
        </p>
        <Button to="/contact" variant="outlineLight" size="lg">
          Book Now
        </Button>
      </div>
    </section>
  );
}
