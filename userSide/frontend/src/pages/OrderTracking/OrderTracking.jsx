


import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import styles from './OrderTracking.module.css';

// ─── Base API URL from env ───────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || '';

// ─── Order status steps (in order) ──────────────────────────────────────────
const STATUS_STEPS = ['Confirmed', 'Preparing', 'Out For Delivery', 'Delivered'];

// ─── Icons for each step ────────────────────────────────────────────────────
const STEP_ICONS = {
  Confirmed: '✅',
  Preparing: '🍳',
  'Out For Delivery': '🚗',
  Delivered: '🎉',
};

/**
 * Visual stepper showing order progress.
 */
function OrderStepper({ currentStatus }) {
  if (currentStatus === 'Cancelled') {
    return (
      <div className={styles.cancelled}>
        <span className={styles.cancelledIcon}>❌</span>
        <span className={styles.cancelledText}>Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className={styles.stepper}>
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className={styles.stepWrapper}>
            <div
              className={`${styles.stepCircle} ${
                isCompleted
                  ? styles.stepCompleted
                  : isActive
                  ? styles.stepActive
                  : styles.stepPending
              }`}
            >
              <span>{STEP_ICONS[step]}</span>
            </div>

            <span
              className={`${styles.stepLabel} ${
                isActive ? styles.stepLabelActive : ''
              }`}
            >
              {step}
            </span>

            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`${styles.stepLine} ${
                  isCompleted ? styles.stepLineCompleted : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Card showing full order details.
 * Matches backend trackingData shape:
 *   order.customerDetails.name  (not order.customerName)
 *   order.orderedItems           (not order.items)
 */
function OrderCard({ order }) {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={styles.orderCard}>
      {/* Order header */}
      <div className={styles.orderHeader}>
        <div>
          <p className={styles.orderLabel}>Order Number</p>
          <p className={styles.orderNumber}>{order.orderNumber}</p>
        </div>
        <div className={styles.orderMeta}>
          <p className={styles.orderLabel}>Placed On</p>
          <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Status stepper */}
      <div className={styles.stepperSection}>
        <OrderStepper currentStatus={order.orderStatus} />
      </div>

      {/* Customer + payment info */}
      <div className={styles.infoGrid}>
        <div className={styles.infoBox}>
          <p className={styles.infoLabel}>Customer</p>
          {/* Backend returns customerDetails.name */}
          <p className={styles.infoValue}>{order.customerDetails?.name}</p>
        </div>
        <div className={styles.infoBox}>
          <p className={styles.infoLabel}>Payment</p>
          <p className={styles.infoValue}>{order.paymentMethod}</p>
        </div>
        <div className={styles.infoBox}>
          <p className={styles.infoLabel}>Payment Status</p>
          <p
            className={`${styles.infoValue} ${
              order.paymentStatus === 'paid'
                ? styles.statusPaid
                : styles.statusPending
            }`}
          >
            {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
          </p>
        </div>
      </div>

      {/* Items ordered */}
      <div className={styles.itemsSection}>
        <p className={styles.itemsTitle}>Items Ordered</p>
        <ul className={styles.itemsList}>
          {/* Backend returns orderedItems (not items) */}
          {order.orderedItems?.map((item, index) => (
            <li key={index} className={styles.itemRow}>
              <span className={styles.itemName}>
                {item.name}
                <span className={styles.itemQty}> × {item.quantity}</span>
              </span>
              <span className={styles.itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalAmount}>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main OrderTracking page component.
 *
 * Supports two ways to arrive on this page:
 *   1. User manually types an order number.
 *   2. After placing an order, redirect with:
 *        navigate('/track', { state: { prefill: data.data.orderNumber } })
 *      This will auto-search on load.
 */
export default function OrderTracking() {
  const location = useLocation();
  const prefill = location.state?.prefill ?? '';

  const [inputValue, setInputValue] = useState(prefill);
  // null = not searched yet | false = not found | object = found
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Fetch order from backend API.
   * Endpoint: GET /api/orders/track/:orderNumber
   * Response shape: { success: true, data: { ...trackingData } }
   */
  const handleSearch = async () => {
    const trimmed = inputValue.trim().toUpperCase();
    if (!trimmed) return;

    setIsLoading(true);
    setSearchResult(null);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/orders/track/${trimmed}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        // 404 → order not found
        setSearchResult(false);
      } else {
        // Backend returns data.data (not data.order)
        setSearchResult(data.data);
      }
    } catch (err) {
      console.error('Track order error:', err);
      setErrorMsg('Could not connect to server. Please try again.');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Auto-search if arriving from checkout with a prefilled order number
  useEffect(() => {
    if (prefill.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Live Updates</span>
          <h1>Track Your Order</h1>
          <p>Enter your order number to see real-time delivery updates.</p>
        </div>
      </header>

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.wrapper}>

            {/* Search box */}
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Enter Order Number (e.g. ORD-1748513847362-X4KP)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Order number"
              />
              <button
                type="button"
                className={styles.searchBtn}
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </div>

            {/* Results area */}
            <div className={styles.results}>

              {/* Initial empty state */}
              {searchResult === null && !isLoading && !errorMsg && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📦</span>
                  <p>Enter your order number above to track your order.</p>
                </div>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <p>Searching for your order...</p>
                </div>
              )}

              {/* Network / server error */}
              {errorMsg && (
                <div className={styles.notFound}>
                  <span className={styles.emptyIcon}>⚠️</span>
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Not found state */}
              {searchResult === false && (
                <div className={styles.notFound}>
                  <span className={styles.emptyIcon}>❌</span>
                  <p>No order found with this number.</p>
                  <p className={styles.notFoundHint}>
                    Please check your order number and try again.
                  </p>
                </div>
              )}

              {/* Order found — show card */}
              {searchResult && <OrderCard order={searchResult} />}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}