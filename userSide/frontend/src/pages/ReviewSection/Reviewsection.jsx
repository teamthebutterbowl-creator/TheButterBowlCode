/**
 * ReviewSection.jsx
 * Place at: src/components/ReviewSection/ReviewSection.jsx
 *
 * Usage:
 * <ReviewSection productId={product._id} averageRating={product.averageRating} totalReviews={product.totalReviews} />
 */

import { useState, useEffect } from 'react';
import StarRating from '../Starrating/Starrating';
import styles from './Reviewsection.module.css';

const API_BASE = 'http://localhost:5000/api';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

// ── Single Review Card ──────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.cardTop}>
        {/* Avatar + name + date */}
        <div className={styles.reviewer}>
          <div className={styles.avatar}>
            {review.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.reviewerName}>{review.customerName}</p>
            <p className={styles.reviewDate}>{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {/* Rating badge — Zomato style */}
        <span className={styles.ratingBadge}>
          ★ {review.rating}
        </span>
      </div>

      {review.comment && (
        <p className={styles.comment}>{review.comment}</p>
      )}

      {/* Source */}
      <span className={styles.sourceBadge}>{review.source}</span>
    </div>
  );
}

// ── Rating Summary — Zomato style ──────────────────────────
function RatingSummary({ averageRating, totalReviews, breakdown }) {
  const bars = [5, 4, 3, 2, 1];

  return (
    <div className={styles.summary}>
      {/* Big number */}
      <div className={styles.summaryLeft}>
        <p className={styles.bigRating}>
          {totalReviews > 0 ? Number(averageRating).toFixed(1) : '—'}
        </p>
        <StarRating rating={averageRating} size="small" />
        <p className={styles.totalCount}>{totalReviews} ratings</p>
      </div>

      {/* Breakdown bars */}
      {totalReviews > 0 && (
        <div className={styles.summaryRight}>
          {bars.map((star) => {
            const count = breakdown[star] || 0;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className={styles.barRow}>
                <span className={styles.barLabel}>★ {star}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className={styles.barCount}>{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Review Form ─────────────────────────────────────────────
function ReviewForm({ productId, onReviewAdded }) {
  const [form, setForm] = useState({ customerName: '', rating: 0, comment: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim()) return setError('Please enter your name');
    if (form.rating === 0) return setError('Please select a rating');

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerName: form.customerName,
          rating: form.rating,
          comment: form.comment,
          source: 'website',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to submit');

      setSuccess(true);
      setForm({ customerName: '', rating: 0, comment: '' });
      onReviewAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>🎉</div>
        <h3>Thank you for your review!</h3>
        <p>Your feedback helps others make better choices.</p>
        <button className={styles.writeAgainBtn} onClick={() => setSuccess(false)}>
          Write Another Review
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>Rate this dish</h3>

      {/* Star selector — big, centered */}
      <div className={styles.starSelector}>
        <StarRating
          rating={form.rating}
          onChange={(val) => { setForm((p) => ({ ...p, rating: val })); setError(''); }}
          interactive
          size="large"
        />
        <p className={styles.starHint}>
          {form.rating === 0 && 'Tap to rate'}
          {form.rating === 1 && 'Poor 😞'}
          {form.rating === 2 && 'Fair 😐'}
          {form.rating === 3 && 'Good 🙂'}
          {form.rating === 4 && 'Very Good 😊'}
          {form.rating === 5 && 'Excellent! 🤩'}
        </p>
      </div>

      {/* Name */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Your Name</label>
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Rahul Sharma"
          className={styles.input}
        />
      </div>

      {/* Comment */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>
          Your Review <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={3}
          placeholder="How was the dish? Share your experience..."
          className={styles.textarea}
        />
      </div>

      {error && <p className={styles.errorMsg}>⚠️ {error}</p>}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}

// ── Main ReviewSection ──────────────────────────────────────
export default function ReviewSection({ productId, averageRating = 0, totalReviews = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Calculate breakdown from reviews
  const breakdown = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  const fetchReviews = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/${productId}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load');
      setReviews(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Ratings & Reviews</h2>

      {/* Rating Summary */}
      <RatingSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
        breakdown={breakdown}
      />

      <div className={styles.divider} />

      {/* Reviews List */}
      {isLoading && <p className={styles.stateMsg}>Loading reviews...</p>}
      {error && <p className={styles.errorMsg}>⚠️ {error}</p>}
      {!isLoading && !error && reviews.length === 0 && (
        <p className={styles.stateMsg}>No reviews yet — be the first!</p>
      )}
      {!isLoading && reviews.length > 0 && (
        <div className={styles.reviewsList}>
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}

      <div className={styles.divider} />

      {/* Form */}
      <ReviewForm productId={productId} onReviewAdded={fetchReviews} />
    </div>
  );
}