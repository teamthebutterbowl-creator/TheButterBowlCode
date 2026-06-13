import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { formatPrice } from '../../utils/formatPrice';
import styles from './OrderConfirmation.module.css';

export default function OrderConfirmation() {
  const location = useLocation();
  // Order data passed from checkout page via navigate state
  // When connecting backend, this will be the real order response
  const order = location.state?.order;

  // Save order number to localStorage so guest can view it later on /my-orders
  useEffect(() => {
    if (!order?.orderNumber) return;

    const saved = JSON.parse(localStorage.getItem("guestOrders") || "[]");
    const filtered = saved.filter((o) => o.orderNumber !== order.orderNumber);
    filtered.unshift({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt || new Date().toISOString(),
    });
    localStorage.setItem("guestOrders", JSON.stringify(filtered.slice(0, 5)));
  }, [order]);

  // If someone visits this page directly without placing an order
  // redirect them to home
  if (!order) {
    return (
      <div className={styles.noOrder}>
        <p>No order found.</p>
        <Link to="/" className={styles.homeLink}>
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.wrapper}>

          {/* Success icon + heading */}
          <div className={styles.successHeader}>
            <div className={styles.checkCircle}>✓</div>
            <h1 className={styles.heading}>Order Placed Successfully!</h1>
            <p className={styles.subheading}>
              Thank you, <strong>{order.customerDetails?.name}</strong>! Your order
              has been confirmed and our kitchen is getting started.
            </p>
          </div>

          {/* Order number — most important info */}
          <div className={styles.orderNumberBox}>
            <p className={styles.orderNumberLabel}>Your Order Number</p>
            <p className={styles.orderNumber}>{order.orderNumber}</p>
            <p className={styles.orderNumberHint}>
              Save this number to track your order
            </p>
          </div>

          {/* Order details */}
          <div className={styles.detailsCard}>
            {/* Items */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Items Ordered</p>
              <ul className={styles.itemsList}>
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
                <span>Total</span>
                <strong className={styles.totalAmount}>
                  {formatPrice(order.finalAmount??order.totalAmount)}
                </strong>
              </div>
            </div>

            {/* Payment + delivery info */}
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <p className={styles.infoLabel}>Payment</p>
                <p className={styles.infoValue}>{order.paymentMethod}</p>
              </div>
              <div className={styles.infoBox}>
                <p className={styles.infoLabel}>Status</p>
                <p className={styles.infoValue}>
                  {order.paymentMethod === 'COD' ? '⏳ Pay on delivery' : '✅ Paid'}
                </p>
              </div>
              <div className={styles.infoBox}>
                <p className={styles.infoLabel}>Deliver To</p>
                <p className={styles.infoValue}>
                  {order.customerDetails?.address}
                </p>
              </div>
              <div className={styles.infoBox}>
                <p className={styles.infoLabel}>Phone</p>
                <p className={styles.infoValue}>
                  {order.customerDetails?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>

            <Link to="/my-orders" className={styles.menuBtn}>
              Track My Order
            </Link>

            <Link to="/order" className={styles.menuBtn}>
              Order More
            </Link>

            <Link to="/" className={styles.homeBtn}>
              Back to Home
            </Link>
          </div>

          {/* COD note */}
          {order.paymentMethod === 'COD' && (
            <p className={styles.codNote}>
              💵 Please keep <strong>{formatPrice(order.totalAmount)}</strong> ready
              for cash payment on delivery.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}