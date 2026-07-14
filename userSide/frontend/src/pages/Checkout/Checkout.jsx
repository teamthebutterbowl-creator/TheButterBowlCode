import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { API_BASE } from '../../config/api';
import { formatPrice } from '../../utils/formatPrice';
import { parseJsonResponse } from '../../utils/apiClient';
import styles from './Checkout.module.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartList, total, itemCount, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // 'valid' | 'invalid' | 'loading'
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponData, setCouponData] = useState(null);
  const [couponWarning, setCouponWarning] = useState('');

  // ─── COD status from backend ─────────────────────────────────────────────
  const [isCODEnabled, setIsCODEnabled] = useState(true);
  const [isPayOnlineEnabled ,setIsPayOnlineEnabled] = useState(true);

  useEffect(() => {
    const fetchCODStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/cod-status`);
        const data = await res.json();
        const enabled = data?.data?.codEnabled ?? true;
        setIsCODEnabled(enabled);
        if (!enabled) {
          setForm((prev) => ({ ...prev, paymentMethod: 'ONLINE' }));
        }
      } catch {
        setIsCODEnabled(true); // fallback: show COD on error
      }
    };
    fetchCODStatus();
  }, []);

  useEffect(()=>{
    const fetchPayOnlineStatus=async()=>{
      try{
        const res= await fetch(`${API_BASE}/api/admin/pay-online-status`)
        const data= await res.json()
        //  console.log('Pay Online API response:', data); 
        const enabled = data?.data?.onlinePayEnabled ;
        //  console.log('isPayOnlineEnabled set to:', enabled);
        setIsPayOnlineEnabled(enabled)
        

      }catch(errr){
          setIsPayOnlineEnabled(true); 
      }
    };
    fetchPayOnlineStatus();

  },[])

  // ─── Form state ─────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });

  // ─── Error state ─────────────────────────────────────────────────────────
  const [errors, setErrors] = useState({});

  // ─── Loading state ───────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

  // ─── API error message ───────────────────────────────────────────────────
  const [apiError, setApiError] = useState('');

  // ─── Handle input change ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  // ─── Validate form fields ─────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
  
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]{2,50}$/.test(form.name.trim())) {
      newErrors.name = 'Enter a valid name';
    }
  
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }
  
    if (!form.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (form.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }
  
    return newErrors;
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponStatus('loading');
    setCouponError('');

    try {
      const response = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: total }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok || !data.success) {
        setCouponStatus('invalid');
        setCouponError(data.message || 'Invalid coupon');
        setCouponDiscount(0);
        setCouponData(null);
      } else {
        setCouponStatus('valid');
        setCouponDiscount(data.data.discountAmount);
        setCouponData(data.data);
      }
    } catch {
      setCouponStatus('invalid');
      setCouponError('Could not validate coupon. Try again.');
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponStatus(null);
    setCouponError('');
    setCouponDiscount(0);
    setCouponData(null);
  };

  // ─── Step 1: Create order in our backend ─────────────────────────────────
  const createOrder = async () => {
    const payload = {
      orderedItems: cartList.map(({ dish, qty }) => ({
        productId: dish._id || dish.id,
        name: dish.name,
        quantity: qty,
        price: dish.price,
      })),
      customerDetails: {
        name: form.name,
        phone: form.phone,
        address: form.address,
      },
      paymentMethod: form.paymentMethod,
      couponCode: couponStatus === 'valid' ? couponCode : undefined,
    };

    const token = localStorage.getItem('butterBowlToken');

    let response;
    try {
      response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error('Cannot reach server. Check that the backend is running.');
    }

    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create order');
    }

    // Guest ho toh guestId localStorage mein save karo
if (data.guestId) {
  localStorage.setItem('guestId', data.guestId);
}

    if (payload.couponCode && (!data.data.appliedCoupon || !data.data.couponDiscount)) {
      setCouponWarning(
        `Coupon "${payload.couponCode}" could not be applied (expired or usage limit reached). You were charged the full amount.`
      );
    }

    return data.data;
  };

  // ─── Step 2a: Handle COD payment ─────────────────────────────────────────
  const handleCOD = async (orderId) => {
    let response;
    try {
      const guestId = localStorage.getItem('guestId');
      response = await fetch(`${API_BASE}/api/payment/cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(guestId ? { 'x-guest-id': guestId } : {}),
        },
        body: JSON.stringify({ orderId }),
      });
    } catch {
      throw new Error('Cannot reach server. Check that the backend is running.');
    }

    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to confirm COD order');
    }

    return data.data;
  };

  // ─── Step 2b: Handle Razorpay online payment ──────────────────────────────
  const handleRazorpay = async (order) => {
    if (typeof window.Razorpay === 'undefined') {
      throw new Error(
        'Payment gateway failed to load. Refresh the page or try Cash on Delivery.'
      );
    }

    const token = localStorage.getItem('butterBowlToken');

    let rzpResponse;
    try {
      const guestId = localStorage.getItem('guestId');
      rzpResponse = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(guestId ? { 'x-guest-id': guestId } : {}),
        },
        body: JSON.stringify({ orderId: order._id }),
      });
    } catch {
      throw new Error('Cannot reach server. Check that the backend is running.');
    }

    const rzpData = await parseJsonResponse(rzpResponse);

    if (!rzpResponse.ok || !rzpData.success) {
      throw new Error(rzpData.message || 'Failed to create Razorpay order');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'The Butter Bowl',
        description: `Order ${order.orderNumber}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        theme: { color: '#1F3D2E' },
        handler: async (response) => {
          try {
            const verifyToken = localStorage.getItem('butterBowlToken');
            const guestId = localStorage.getItem('guestId');
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(verifyToken ? { Authorization: `Bearer ${verifyToken}` } : {}),
                ...(guestId ? { 'x-guest-id': guestId } : {}),
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              }),
            });

            const verifyData = await parseJsonResponse(verifyRes);

            if (!verifyRes.ok || !verifyData.success) {
              reject(new Error(verifyData.message || 'Payment verification failed'));
            } else {
              resolve(verifyData.data);
            }
          } catch (err) {
            reject(err);
          }
        },
        modal: {
  ondismiss: async () => {
    try {
      const guestId = localStorage.getItem("guestId");
      const token = localStorage.getItem("butterBowlToken");

      await fetch(`${API_BASE}/api/payment/cancel/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(guestId ? { "x-guest-id": guestId } : {}),
        },
      });
    } catch (err) {
      console.error("Cancel payment API failed", err);
    }

    reject(new Error("Payment cancelled by user"));
  },
},
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  // ─── Main submit handler ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Submit clicked");

    const validationErrors = validate();
      console.log("2. Validation:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
       console.log("3. Validation failed");
      setErrors(validationErrors);
      return;
    }
      console.log("4. Validation passed");

    if (itemCount === 0) {
       console.log("5. Cart is empty");
      setApiError('Your cart is empty. Please add items before checking out.');
      return;
    }
      console.log("6. Creating order...");

    setIsLoading(true);
    setApiError('');
    setCouponWarning('');

    try {
      const order = await createOrder();
         console.log("7. Order created:", order);

      let finalOrder;

      if (form.paymentMethod === 'COD') {
         console.log("8. COD flow");
        finalOrder = await handleCOD(order._id);
      } else {
          console.log("8. ONLINE flow");
        finalOrder = await handleRazorpay(order);
      }

      clearCart();
      navigate('/order-confirmation', { state: { order: finalOrder } });
       console.log("9. Success");

    } catch (error) {
      setApiError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── If cart is empty, show empty state ──────────────────────────────────
  if (itemCount === 0) {
    return (
      <section className={styles.page}>
        <div className="container">
          <div className={styles.emptyCart}>
            <span className={styles.emptyIcon}>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add some delicious dishes before checking out.</p>
            <Link to="/order" className={styles.menuLink}>
              Browse Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Almost There</span>
          <h1>Checkout</h1>
          <p>Fill in your details and place your order.</p>
        </div>
      </header>

      <section className={`section ${styles.page}`}>
        <div className="container">
          <div className={styles.layout}>

            {/* ── Left: Delivery + Payment form ── */}
            <div className={styles.formSection}>
              <form onSubmit={handleSubmit} noValidate>

                {/* Delivery details */}
                <div className={styles.formCard}>
                  <h2 className={styles.cardTitle}>Delivery Details</h2>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Full Name</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                        setForm((prev) => ({ ...prev, name: value }));
                        setErrors((prev) => ({ ...prev, name: '' }));
                        setApiError('');
                      }}
                        maxLength={50}
                       autoComplete="name"
                    
                      className={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone Number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setForm((prev) => ({ ...prev, phone: value }));
                        setErrors((prev) => ({ ...prev, phone: '' }));
                        setApiError('');
                      }}
                      maxLength={10}
                    inputMode="numeric"
                     autoComplete="tel"
                    
                      className={errors.phone ? styles.inputError : ''}
                    />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Delivery Address</span>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                     
                        rows={3}
                        maxLength={250}
                        autoComplete="street-address"
                      className={errors.address ? styles.inputError : ''}
                    />
                    {errors.address && <span className={styles.error}>{errors.address}</span>}
                  </label>
                </div>

                {/* Payment method */}
                <div className={styles.formCard}>
                  <h2 className={styles.cardTitle}>Payment Method</h2>

                  <div className={styles.paymentOptions}>

                    {/* COD option — conditionally shown based on admin setting */}
                    {isCODEnabled ? (
                      <label
                        className={`${styles.paymentOption} ${
                          form.paymentMethod === 'COD' ? styles.paymentSelected : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={form.paymentMethod === 'COD'}
                          onChange={handleChange}
                        />
                        <div className={styles.paymentContent}>
                          <span className={styles.paymentIcon}>💵</span>
                          <div>
                            <p className={styles.paymentTitle}>Cash on Delivery</p>
                            <p className={styles.paymentDesc}>Pay when your order arrives</p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div
                        className={styles.paymentOption}
                        style={{
                          opacity: 0.5,
                          cursor: 'not-allowed',
                          background: 'var(--color-background-secondary)',
                        }}
                      >
                        <div className={styles.paymentContent}>
                          <span className={styles.paymentIcon}>💵</span>
                          <div>
                            <p className={styles.paymentTitle}>Cash on Delivery</p>
                            <p className={styles.paymentDesc} style={{ color: '#dc2626' }}>
                              Cash on Delivery is currently unavailable. Please use online payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Online payment option */}
                  {/* Online payment option */}
{isPayOnlineEnabled ? (
  <label
    className={`${styles.paymentOption} ${
      form.paymentMethod === 'ONLINE' ? styles.paymentSelected : ''
    }`}
  >
    <input
      type="radio"
      name="paymentMethod"
      value="ONLINE"
      checked={form.paymentMethod === 'ONLINE'}
      onChange={handleChange}
    />
    <div className={styles.paymentContent}>
      <span className={styles.paymentIcon}>💳</span>
      <div>
        <p className={styles.paymentTitle}>Pay Online</p>
        <p className={styles.paymentDesc}>UPI, Cards, Net Banking via Razorpay</p>
      </div>
    </div>
  </label>
) : (
  <div
    className={styles.paymentOption}
    style={{
      opacity: 0.5,
      cursor: 'not-allowed',
      background: 'var(--color-background-secondary)',
    }}
  >
    <div className={styles.paymentContent}>
      <span className={styles.paymentIcon}>💳</span>
      <div>
        <p className={styles.paymentTitle}>Pay Online</p>
        <p className={styles.paymentDesc} style={{ color: '#dc2626' }}>
          Online payment is currently unavailable. Please use Cash on Delivery.
        </p>
      </div>
    </div>
  </div>
)}
                   

                  </div>
                </div>
                  

                {/* Coupon Code */}
                <div className={styles.formCard}>
                  <h2 className={styles.cardTitle}>Have a Coupon?</h2>

                  {couponStatus === 'valid' ? (
                    <div className={styles.couponApplied}>
                      <span>
                        🎉 <strong>{couponData.code}</strong> applied — you save{' '}
                        {formatPrice(couponDiscount)}!
                      </span>
                      <button type="button" onClick={removeCoupon} className={styles.removeCoupon}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className={styles.couponRow}>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        className={styles.couponInput}
                      />
                      <button
                        type="button"
                        onClick={validateCoupon}
                        disabled={couponStatus === 'loading' || !couponCode.trim()}
                        className={styles.couponBtn}
                      >
                        {couponStatus === 'loading' ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}

                  {couponError && <p className={styles.error}>{couponError}</p>}
                </div>

                {/* API error */}
                {apiError && (
                  <div className={styles.apiError}>⚠️ {apiError}</div>
                )}

                {couponWarning && (
                  <div
                    className={styles.apiError}
                    style={{ background: '#fff7ed', borderColor: '#fb923c', color: '#c2410c' }}
                  >
                    ⚠️ {couponWarning}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Placing Order...'
                    : form.paymentMethod === 'COD'
                    ? `Place Order • ${formatPrice(Math.max(0, total - couponDiscount))}`
                    : `Pay ${formatPrice(Math.max(0, total - couponDiscount))}`}
                </button>

              </form>
            </div>

            {/* ── Right: Order summary ── */}
            <aside className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <ul className={styles.summaryItems}>
                  {cartList.map(({ dish, qty }) => (
                    <li key={dish.id} className={styles.summaryItem}>
                      <span className={styles.summaryItemName}>
                        {dish.name}
                        <span className={styles.summaryItemQty}> × {qty}</span>
                      </span>
                      <span className={styles.summaryItemPrice}>
                        {formatPrice(dish.price * qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={styles.summaryBreakdown}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                      <span>Coupon ({couponData?.code})</span>
                      <span>− {formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <div className={`${styles.summaryTotal} ${styles.summaryFinal}`}>
                    <span>Final Amount</span>
                    <strong>{formatPrice(Math.max(0, total - couponDiscount))}</strong>
                  </div>
                </div>

                <Link to="/order" className={styles.editCartLink}>
                  ← Edit Cart
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}