/**
 * StarRating.jsx
 * Place at: src/components/StarRating/StarRating.jsx
 *
 * Reusable star component — 2 modes:
 * 1. Display mode — sirf stars dikhao (readonly)
 * 2. Input mode   — click karke rating select karo
 *
 * Usage:
 * Display: <StarRating rating={4.2} />
 * Input:   <StarRating rating={value} onChange={setValue} interactive />
 */

import { useState } from 'react';
import styles from './Starrating.module.css';

export default function StarRating({ 
  rating = 0,        // current rating value
  onChange,          // only needed in interactive mode
  interactive = false, // true = input mode, false = display mode
  size = 'medium',   // 'small' | 'medium' | 'large'
}) {
  // hovered star track karo (sirf interactive mode mein)
  const [hovered, setHovered] = useState(0);

  // 5 stars banao
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`${styles.stars} ${styles[size]}`}>
      {stars.map((star) => {
        // ye star filled hoga agar:
        // interactive mode mein — hover ya selected
        // display mode mein — rating se kam ya equal
        const isFilled = interactive
          ? star <= (hovered || rating)
          : star <= Math.round(rating);

        return (
          <span
            key={star}
            className={`${styles.star} ${isFilled ? styles.filled : styles.empty}`}
            // interactive mode mein click/hover handlers
            onClick={() => interactive && onChange && onChange(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}