
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './ProductDetail.module.css';
import { API_BASE } from '../../config/api';

// Format price as Indian Rupees
const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

// Star rating display component
function StarRating({ rating, size = 'sm' }) {
  return (
    <div className={`${styles.stars} ${size === 'lg' ? styles.starsLg : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Interactive star input for review form
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={styles.starInput}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.starBtn} ${
            star <= (hovered || value) ? styles.starBtnFilled : ''
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const { user, isLoggedIn } = useAuth();

  // Product state
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const { addItem, removeItem, cartList } = useCart();

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 0,
    comment: '',
  });
  const [reviewErrors, setReviewErrors] = useState({});
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Cart quantity
  const[qty,setQuantity]=useState(1);

  // ─── Fetch product ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      console.log('ProductDetail: Fetching product:', id);
      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await response.json();
        console.log('ProductDetail: Product response:', data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Product not found');
        }

        setProduct(data.data);
      } catch (error) {
        console.log('ProductDetail: Error:', error.message);
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ─── Fetch reviews ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchReviews = async () => {
      console.log('ProductDetail: Fetching reviews for:', id);
      setReviewsLoading(true);

      try {
        const response = await fetch(`${API_BASE}/api/reviews/${id}`);
        const data = await response.json();
        console.log('ProductDetail: Reviews response:', data);

        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.log('ProductDetail: Reviews error:', error.message);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  // handle go to order
  const handleGoToorder=()=>{
    addItem(product,qty);
    // navigate('/order')
  }

   
   const completeOrder=()=>{
     navigate('/order')
  }
  // ─── Handle review form ──────────────────────────────────────────────────
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
    setReviewErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateReview = () => {
    const errors = {};
    if (!reviewForm.customerName.trim()) errors.customerName = 'Name is required';
    if (!reviewForm.rating) errors.rating = 'Please select a rating';
    if (!reviewForm.comment.trim()) errors.comment = 'Review is required';
    return errors;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const errors = validateReview();
    if (Object.keys(errors).length > 0) {
      setReviewErrors(errors);
      return;
    }

    setReviewSubmitting(true);
    setReviewSuccess('');

    try {
      console.log('ProductDetail: Submitting review...');

      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          customerName: reviewForm.customerName,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          source: 'website',
        }),
      });

      const data = await response.json();
      console.log('ProductDetail: Review submitted:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      // Add new review to list
      setReviews((prev) => [data.data, ...prev]);

      // Update product rating
      setProduct((prev) => ({
        ...prev,
        averageRating: parseFloat(prev.averageRating || 0),
        totalReviews: (prev.totalReviews || 0) + 1,
      }));

      // Reset form
      setReviewForm({ customerName: '', rating: 0, comment: '' });
      setShowReviewForm(false);
      const response2 = await fetch(`${API_BASE}/api/products/${id}`);
const updated = await response2.json();
if (updated.success) setProduct(updated.data);
      setReviewSuccess('Thank you for your review!');

    } catch (error) {
      console.log('ProductDetail: Review error:', error.message);
      setReviewErrors({ submit: error.message });
    } finally {
      setReviewSubmitting(false);
    }
  };

 


  // ─── Loading state ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className={styles.page}>
        <div className="container">
          <div className={styles.centerState}>
            <p>Loading product...</p>
          </div>
        </div>
      </section>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────
  if (apiError || !product) {
    return (
      <section className={styles.page}>
        <div className="container">
          <div className={styles.centerState}>
            <p className={styles.errorText}>⚠️ {apiError || 'Product not found'}</p>
            <button onClick={() => navigate('/order')} className={styles.backBtn}>
              ← Back to Menu
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className="container">

        {/* Back button */}
        <button onClick={() => navigate(-1)} className={styles.backLink}>
          ← Back to Menu
        </button>

        {/* ─── Product section ─── */}
        <div className={styles.productGrid}>

          {/* Left — Image */}
          <div className={styles.imageSection}>
            <div className={styles.imageFrame}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className={styles.productImage} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>🍲</span>
                </div>
              )}
              {/* Veg badge
              {product.isVeg && (
                <span className={styles.vegBadge}>🟢 Veg</span>
              )} */}
            </div>
          </div>

          {/* Right — Details */}
          <div className={styles.detailsSection}>

            {/* Category */}
            <span className={styles.category}>{product.category?.name}</span>

            {/* Name */}
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            {product.totalReviews > 0 && (
              <div className={styles.ratingRow}>
                <StarRating rating={product.averageRating} size="lg" />
                <span className={styles.ratingText}>
                  {parseFloat(product.averageRating).toFixed(1)}
                  <span className={styles.reviewCount}>
                    ({product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </span>
              </div>
            )}

            {/* Price */}
            <p className={styles.price}>{formatPrice(product.price)}</p>

            {/* Description */}
            <p className={styles.description}>{product.description}</p>

            {/* Includes (for combos) */}
            {product.includes?.length > 0 && (
              <div className={styles.includesSection}>
                <p className={styles.sectionLabel}>What's Included</p>
                <ul className={styles.includesList}>
                  {product.includes.map((item, i) => (
                    <li key={i} className={styles.includesItem}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div className={styles.ingredientsSection}>
                <p className={styles.sectionLabel}>Ingredients</p>
                <div className={styles.tagsList}>
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className={styles.tag}>{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            {product.isAvailable ? (
              <div className={styles.cartRow}>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q)=>Math.max(1,q-1))}
                    disabled={qty === 0}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q)=>q+1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.addToCartBtn}
                  onClick={handleGoToorder}
                >

                  Add To Cart
                </button>
                  <button
                  className={styles.proceedBtn}
                  onClick={completeOrder}
                >
                  Proceed to Checkout
               
                </button>
                
                
              </div>
            ) : (
              <p className={styles.unavailable}>Currently Unavailable</p>
            )}
            

          </div>
        </div>

        {/* ─── Reviews section ─── */}
         <div className={styles.reviewsSection}>
         <div className={styles.overallRating}>
  <span className={styles.overallScore}>
    {product.averageRating
      ? Number(product.averageRating).toFixed(1)
      : '0.0'}
  </span>

  <StarRating rating={product.averageRating || 0} />

  <span className={styles.overallCount}>
    ({product.totalReviews || 0} Reviews)
  </span>
</div>
<div className={styles.reviewsHeader}>
  <h2 className={styles.reviewsTitle}>Customer Reviews</h2>

  <button
    className={styles.writeReviewBtn}
    onClick={() => setShowReviewForm((v) => !v)}
  >
    {showReviewForm ? 'Cancel' : '+ Write a Review'}
  </button>
</div>      

         



          {/* Review success message */}
          {reviewSuccess && (
            <p className={styles.reviewSuccess}>✅ {reviewSuccess}</p>
          )}

          {/* Review form */}
          {showReviewForm && (
            <form className={styles.reviewForm} onSubmit={handleReviewSubmit} noValidate>
              <h3 className={styles.formTitle}>Your Review</h3>

              <label className={styles.formField}>
                <span className={styles.formLabel}>Your Name</span>
                <input
                  type="text"
                  name="customerName"
                  value={reviewForm.customerName}
                  onChange={handleReviewChange}
                  placeholder="Rahul Sharma"
                  className={reviewErrors.customerName ? styles.inputError : ''}
                />
                {reviewErrors.customerName && (
                  <span className={styles.fieldError}>{reviewErrors.customerName}</span>
                )}
              </label>

              <div className={styles.formField}>
                <span className={styles.formLabel}>Rating</span>
                <StarInput
                  value={reviewForm.rating}
                  onChange={(val) => {
                    setReviewForm((prev) => ({ ...prev, rating: val }));
                    setReviewErrors((prev) => ({ ...prev, rating: '' }));
                  }}
                />
                {reviewErrors.rating && (
                  <span className={styles.fieldError}>{reviewErrors.rating}</span>
                )}
              </div>

              <label className={styles.formField}>
                <span className={styles.formLabel}>Your Review</span>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className={reviewErrors.comment ? styles.inputError : ''}
                />
                {reviewErrors.comment && (
                  <span className={styles.fieldError}>{reviewErrors.comment}</span>
                )}
              </label>

              {reviewErrors.submit && (
                <p className={styles.fieldError}>⚠️ {reviewErrors.submit}</p>
              )}

              <button
                type="submit"
                className={styles.submitReviewBtn}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews list */}
          {reviewsLoading ? (
            <p className={styles.reviewsLoading}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className={styles.noReviews}>
              No reviews yet. Be the first to review this dish!
            </p>
          ) : (
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review._id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerAvatar}>
                        {review.customerName?.[0]?.toUpperCase()}
                      </span>
                      <div>
                        <p className={styles.reviewerName}>{review.customerName}</p>
                        <p className={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className={styles.reviewComment}>{review.comment}</p>
                  )}
                  {review.source !== 'website' && (
                    <span className={styles.reviewSource}>via {review.source}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}