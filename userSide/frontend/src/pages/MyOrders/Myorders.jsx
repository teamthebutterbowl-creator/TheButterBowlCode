import { useState, useEffect } from "react";
import { fetchMyOrders, fetchOrderByOrderNumber } from "../../services/orderServices";
import "./Myorders.css";

const statusStyles = {
  Pending: "status-pending",
  Confirmed: "status-confirmed",
  Preparing: "status-preparing",
  "Out For Delivery": "status-out-for-delivery",
  Delivered: "status-delivered",
  Cancelled: "status-cancelled",
};

const paymentStyles = {
  paid: "payment-paid",
  pending: "payment-pending",
  failed: "payment-failed",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAddress = (address) => {
  if (!address) return "N/A";
  if (typeof address === "string") return address;
  const { street, area, city, state, pincode, zipCode } = address;
  return [street, area, city, state, pincode || zipCode].filter(Boolean).join(", ");
};

// Reusable order card — works for both logged-in orders and guest tracked order
const OrderCard = ({ order, isExpanded, onToggle }) => {
  const itemCount =
    order.orderedItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const amountToShow = order.finalAmount ?? order.totalAmount ?? 0;

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-id-block">
          <span className="order-label">Order ID</span>
          <span className="order-id">
            {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
          </span>
        </div>
        <div className="order-date-block">
          <span className="order-label">Order Date</span>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>
      </div>

      <div className="order-card-body">
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="order-label">Total Amount</span>
            <span className="order-amount">₹{amountToShow.toFixed(2)}</span>
          </div>

          <div className="order-info-item">
            <span className="order-label">Payment Status</span>
            <span className={`badge ${paymentStyles[order.paymentStatus] || "payment-pending"}`}>
              {order.paymentStatus || "pending"}
            </span>
          </div>

          <div className="order-info-item">
            <span className="order-label">Order Status</span>
            <span className={`badge ${statusStyles[order.orderStatus] || "status-pending"}`}>
              {order.orderStatus || "Pending"}
            </span>
          </div>

          <div className="order-info-item">
            <span className="order-label">Items</span>
            <span className="order-items-count">{itemCount}</span>
          </div>
        </div>

        <button className="view-details-btn" onClick={onToggle}>
          {isExpanded ? "Hide Details" : "View Details"}
        </button>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className="details-section">
            <h3 className="details-heading">Ordered Items</h3>
            <div className="items-table">
              <div className="items-table-header">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
              </div>
              {order.orderedItems?.map((item, idx) => (
                <div className="items-table-row" key={idx}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">{item.quantity}</span>
                  <span className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {(order.offerDiscount > 0 || order.couponDiscount > 0) && (
              <div className="discount-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
                {order.offerDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Offer Discount</span>
                    <span>− ₹{order.offerDiscount.toFixed(2)}</span>
                  </div>
                )}
                {order.couponDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Coupon Discount</span>
                    <span>− ₹{order.couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total-row">
                  <span>Total Paid</span>
                  <span>₹{order.finalAmount?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="details-grid">
            <div className="details-section">
              <h3 className="details-heading">Delivery Address</h3>
              <p className="details-text">{formatAddress(order.customerDetails?.address)}</p>
            </div>

            <div className="details-section">
              <h3 className="details-heading">Payment Method</h3>
              <p className="details-text">{order.paymentMethod || "N/A"}</p>
            </div>
          </div>

          {order.orderNotes && (
            <div className="details-section">
              <h3 className="details-heading">Order Notes</h3>
              <p className="details-text notes-text">{order.orderNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const isLoggedIn = !!localStorage.getItem("butterBowlToken");

  // Logged-in state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(isLoggedIn);
  const [error, setError] = useState(null);

  // Guest state
  const [orderIdInput, setOrderIdInput] = useState("");
  const [guestOrder, setGuestOrder] = useState(null);
  const [guestLoading, setGuestLoading] = useState(!isLoggedIn);
  const [guestError, setGuestError] = useState(null);
  const [hasLocalOrder, setHasLocalOrder] = useState(false);

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Logged-in: fetch full order history
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchMyOrders();
        setOrders(res.data || []);
      } catch (err) {
       
        setError(err.message || "Something went wrong while fetching your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn]);

  // Guest: check localStorage for a recent order and auto-load it
  useEffect(() => {
    if (isLoggedIn) return;

    const saved = JSON.parse(localStorage.getItem("guestOrders") || "[]");

    if (saved.length === 0) {
      setGuestLoading(false);
      setHasLocalOrder(false);
      return;
    }

    setHasLocalOrder(true);
    const mostRecent = saved[0];

    const autoLoad = async () => {
      try {
        setGuestLoading(true);
        const res = await fetchOrderByOrderNumber(mostRecent.orderNumber);
        setGuestOrder(res.data);
        setExpandedOrderId(res.data.orderNumber);
      } catch (err) {
        // Order no longer exists / invalid — clear it and fall back
        const filtered = saved.filter((o) => o.orderNumber !== mostRecent.orderNumber);
        localStorage.setItem("guestOrders", JSON.stringify(filtered));
        setHasLocalOrder(false);
      } finally {
        setGuestLoading(false);
      }
    };

    autoLoad();
  }, [isLoggedIn]);

  const toggleDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleGuestSearch = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    try {
      setGuestLoading(true);
      setGuestError(null);
      setGuestOrder(null);
      const res = await fetchOrderByOrderNumber(orderIdInput);
      setGuestOrder(res.data);
      setExpandedOrderId(res.data.orderNumber); // auto-expand
    } catch (err) {
      setGuestError(err.message || "We couldn't find an order with that ID.");
    } finally {
      setGuestLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // GUEST VIEW (not logged in)
  // ─────────────────────────────────────────
  if (!isLoggedIn) {
    // Still checking localStorage / auto-fetching the saved order
    if (guestLoading) {
      return (
        <div className="my-orders-page">
          <div className="my-orders-container">
            <h1 className="my-orders-title">My Orders</h1>
            <div className="state-container">
              <div className="loading-spinner"></div>
              <p className="state-text">Loading your orders...</p>
            </div>
          </div>
        </div>
      );
    }

    // Found and loaded a recent order from this device — show it directly
    if (guestOrder) {
      return (
        <div className="my-orders-page">
          <div className="my-orders-container">
            <h1 className="my-orders-title">My Orders</h1>
            <p className="my-orders-subtitle">
              Here's your most recent order from this device
            </p>

            <div className="orders-list">
              <OrderCard
                order={guestOrder}
                isExpanded={expandedOrderId === guestOrder.orderNumber}
                onToggle={() => toggleDetails(guestOrder.orderNumber)}
              />
            </div>

            <div className="guest-login-prompt">
              <p>Want to see all your past orders in one place?</p>
              <a href="/auth" className="browse-menu-btn">
                Sign In
              </a>
            </div>
          </div>
        </div>
      );
    }

    // No saved order on this device — empty state + manual search fallback
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <h1 className="my-orders-title">My Orders</h1>

          <div className="state-container empty-state">
            <p className="state-text">No orders found on this device.</p>
          </div>

          <p className="my-orders-subtitle">
            Already have an order? Look it up using your Order ID
          </p>

          <form className="guest-search-form" onSubmit={handleGuestSearch}>
            <input
              type="text"
              className="guest-search-input"
              placeholder="Enter your Order ID (e.g. ORD-1748513847362-X4KP)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
            />
            <button type="submit" className="guest-search-btn" disabled={guestLoading}>
              {guestLoading ? "Searching..." : "Find Order"}
            </button>
          </form>

          {guestError && <p className="guest-error-text">{guestError}</p>}

          <div className="guest-login-prompt">
            <p>Have an account?</p>
            <a href="/login" className="browse-menu-btn">
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // LOGGED-IN VIEW
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <h1 className="my-orders-title">My Orders</h1>
          <div className="state-container">
            <div className="loading-spinner"></div>
            <p className="state-text">Fetching your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <h1 className="my-orders-title">My Orders</h1>
          <div className="state-container error-state">
            <p className="state-text">{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <h1 className="my-orders-title">My Orders</h1>
          <div className="state-container empty-state">
            <p className="state-text">You haven't placed any orders yet.</p>
            <a href="/menu" className="browse-menu-btn">
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <h1 className="my-orders-title">My Orders</h1>
        <p className="my-orders-subtitle">
          A history of every dish crafted and delivered to you
        </p>

        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isExpanded={expandedOrderId === order._id}
              onToggle={() => toggleDetails(order._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;