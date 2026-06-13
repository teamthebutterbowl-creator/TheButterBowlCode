/**
 * Food image with shimmer loading and category-based fallbacks on error.
 */
import { useState, useCallback, useEffect,useRef } from 'react';
import {
  DEFAULT_FOOD_IMAGE,
  categoryPlaceholders,
  resolveFoodImage,
} from '../../data/foodPlaceholders';
import styles from './FoodImage.module.css';

export default function FoodImage({
  src,
  alt = '',
  category,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  ...props
}) {
  const initialSrc = resolveFoodImage(src, category);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // useEffect(() => {
  //   setCurrentSrc(resolveFoodImage(src, category));
  //   setLoaded(false);
  // }, [src, category]);
  useEffect(() => {
    // Agar image already cached hai toh onLoad fire nahi karta
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [currentSrc]);

  // const handleError = useCallback(() => {
  //   const categoryFallback = category && categoryPlaceholders[category];
  //   setCurrentSrc((prev) => {
  //     if (categoryFallback && prev !== categoryFallback) return categoryFallback;
  //     if (prev !== DEFAULT_FOOD_IMAGE) return DEFAULT_FOOD_IMAGE;
  //     return prev;
  //   });
  // }, [category]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    console.log("FoodImage src:", src);
console.log("FoodImage category:", category);
  }, []);

  return (
    <div className={`${styles.wrap} ${className} ${loaded ? styles.loaded : ''}`}>
      {!loaded && <div className={styles.shimmer} aria-hidden="true" />}
      {/* <img
        {...props}
        src={currentSrc}
        alt={alt}
        loading={loading}
        className={`${styles.img} ${imgClassName}`}
        onError={handleError}
        onLoad={handleLoad}
        decoding="async"
      /> */}
      <img
  ref={imgRef}
  src={src || DEFAULT_FOOD_IMAGE}
  alt={alt}
  loading={loading}
  className={`${styles.img} ${imgClassName}`}
  onLoad={handleLoad}
  decoding="async"
/>
    </div>
  );
}
