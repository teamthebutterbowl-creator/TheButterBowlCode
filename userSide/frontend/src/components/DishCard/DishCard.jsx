import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import FoodImage from '../FoodImage/FoodImage';
import styles from './DishCard.module.css';

function DishCard({ dish, compact = false, onClick , offer = null}) {
  return (
    <article
      className={`${styles.card} ${compact ? styles.compact : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.imageWrap}>
        <FoodImage
          // src={dish.image}
          src={dish.images?.[0] || ''}
          alt={dish.name}
          category={dish.category?.name}
            loading="lazy"
        />
          {offer && (
    <span className={styles.offerBadge}>
      {offer.discountType === 'percentage'
        ? `${offer.discountValue}% OFF`
        : `Flat ₹${offer.discountValue} OFF`}
    </span>
  )}
      </div>

      <div className={styles.body}>
        {/* Top row — veg indicator + category */}
        <div className={styles.topRow}>
          {/* Veg indicator — green square with dot */}
          {dish.isVeg !== false && (
            <span className={styles.vegIndicator} title="Pure Veg">
              <span className={styles.vegDot} />
            </span>
          )}
          {dish.category && (
            <span className={styles.categoryBadge}>{dish.category?.name}</span>
          )}
        </div>

        <h3 className={styles.name}>{dish.name}</h3>
        <p className={styles.desc}>{dish.description}</p>

        <div className={styles.footer}>
  <div className={styles.priceBlock}>
    {offer ? (
      <>
        <span className={styles.originalPrice}>{formatPrice(dish.price)}</span>
        <span className={styles.discountedPrice}>
          {formatPrice(
            offer.discountType === 'percentage'
              ? dish.price - (dish.price * offer.discountValue) / 100
              : Math.max(0, dish.price - offer.discountValue)
          )}
        </span>
      </>
    ) : (
      <span className={styles.price}>{formatPrice(dish.price)}</span>
    )}
  </div>

  {dish.totalReviews > 0 && (
    <span className={styles.rating}>
      ⭐ {Number(dish.averageRating).toFixed(1)}
      <span className={styles.ratingCount}>({dish.totalReviews})</span>
    </span>
  )}
</div>
      </div>
    </article>
  );
}

export default React.memo(DishCard)