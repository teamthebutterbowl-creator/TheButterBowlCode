
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button/Button';
import FoodImage from '../../components/FoodImage/FoodImage';
import styles from './OrderOnline.module.css';
import { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

// Format price as Indian Rupees
const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

/** Decorative bowl icon shown behind food photos in the menu grid */
function FoodIcon() {
  return (
    <svg
      className={styles.foodIconSvg}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <path d="M8 22h32c0 6-5 11-16 11S8 28 8 22z" />
      <path d="M14 14c0-3 2.5-6 10-6s10 3 10 6" />
      <path d="M24 33v4" strokeLinecap="round" />
    </svg>
  );
}

export default function OrderOnline() {
  const navigate = useNavigate();
  const { cartList, total, itemCount, addItem, removeItem } = useCart();
  const [activeOffers, setActiveOffers] = useState([]);
 
  useEffect(() => {
    fetch(`${API_BASE}/offers/active`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setActiveOffers(data.data); })
      .catch(() => {}); // silent fail — offers optional hain
  }, []);

  // Helper — dish ke liye matching offer dhundo
const getOfferForDish = (dish) => {
  return activeOffers.find((offer) => {
    if (offer.scope === 'menu') return true;
    if (offer.scope === 'product') {
      return offer.applicableProducts?.some(
        (p) => (p._id || p) === (dish._id || dish.id)
      );
    }
    if (offer.scope === 'category') {
      return offer.applicableCategories?.some(
        (c) => (c._id || c) === (dish.category?._id || dish.category)
      );
    }
    return false;
  }) || null;
};



  return (
    <>
      <header className={`page-hero ${styles.orderHero}`}>
        <div className="container">
          <span className="section-label">From Our Kitchen</span>
          <h1>Your Cart</h1>
          <p>Review your order before checkout.</p>
        </div>
      </header>
  
      <section className={`section ${styles.order}`}>
        <div className={`container ${styles.layout}`}>
  
          {/* Cart Items — main section */}
          <div className={styles.main}>
            {cartList.length === 0 ? (
              <div className={styles.emptyCart}>
                <p className={styles.emptyTitle}>Your cart is empty</p>
                <p className={styles.emptyDesc}>Browse the menu to add items.</p>
                <button
                  className={styles.browseBtn}
                  onClick={() => navigate('/menu')}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className={styles.items}>
                {cartList.map(({ dish, qty }) => (
                  <article key={dish._id} className={styles.foodCard}>
                    <div className={styles.foodImageWrap}>
                      <FoodImage
                        src={dish.images?.[0]}
                        alt={dish.name}
                        category={dish.category?.name}
                        className={styles.foodImg}
                        loading="eager"
                      />
                    </div>
                    <div className={styles.foodBody}>
                    <div className={styles.foodText}>
  <h3>{dish.name}</h3>
  <p>{dish.description}</p>

  {/* Offer badge + price */}
  {(() => {
    const offer = getOfferForDish(dish);
    if (!offer) return <span className={styles.price}>{formatPrice(dish.price)}</span>;

    const discounted = offer.discountType === 'percentage'
      ? dish.price - (dish.price * offer.discountValue) / 100
      : Math.max(0, dish.price - offer.discountValue);

    return (
      <div className={styles.priceBlock}>
        <span className={styles.offerBadge}>
          {offer.discountType === 'percentage'
            ? `${offer.discountValue}% OFF`
            : `Flat ₹${offer.discountValue} OFF`}
        </span>
        <span className={styles.originalPrice}>{formatPrice(dish.price)}</span>
        <span className={styles.discountedPrice}>{formatPrice(discounted)}</span>
      </div>
    );
  })()}
</div>
                      <div className={styles.qtyRow}>
                        <span className={styles.qtyLabel}>Quantity</span>
                        <div className={styles.qty}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => removeItem(dish._id)}
                            disabled={qty === 0}
                          >−</button>
                          <span className={styles.qtyValue}>{qty}</span>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => addItem(dish)}
                          >+</button>
                        </div>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => {
                            // Pura item remove karo
                            for (let i = 0; i < qty; i++) removeItem(dish._id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className={styles.itemTotal}>
                      {formatPrice(dish.price * qty)}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </div>
  
          {/* Order Summary */}
          <aside className={styles.cart} aria-label="Order summary">
            <div className={styles.cartInner}>
              <h2 className={styles.cartTitle}>Order Summary</h2>
              <div className={styles.cartBody}>
                {cartList.length === 0 ? (
                  <p className={styles.empty}>No items added yet.</p>
                ) : (
                  <ul className={styles.cartList}>
                    {cartList.map(({ dish, qty }) => (
                      <li key={dish._id} className={styles.cartItem}>
                        <span className={styles.cartItemName}>
                          {dish.name}
                          <span className={styles.cartItemQty}>× {qty}</span>
                        </span>
                        <span className={styles.cartItemPrice}>
                          {formatPrice(dish.price * qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.cartFooter}>
                <div className={styles.cartTotal}>
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <Button
                  className={styles.checkoutBtn}
                  variant="primary"
                  onClick={() => navigate('/checkout')}
                  disabled={itemCount === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </aside>
  
        </div>
      </section>
    </>
  );
}
