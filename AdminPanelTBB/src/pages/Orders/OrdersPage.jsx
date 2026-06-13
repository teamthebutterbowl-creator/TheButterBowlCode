import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/shared/PageHeader/PageHeader';
import SearchBar from '../../components/shared/SearchBar/SearchBar';
import Table from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import StatusBadge from '../../components/shared/StatusBadge/StatusBadge';
import { User, MapPin, ShoppingBag, CreditCard, ClipboardList, Receipt,Eye } from 'lucide-react';

import './OrdersPage.css';

const API_BASE=import.meta.env.VITE_API_BASE_URL
console.log("TOKEN:", localStorage.getItem("token"));
const gettoken=()=>localStorage.getItem('token');
const authHeaders=()=>({Authorization:`Bearer ${gettoken()}`})

const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  if (typeof value === 'number') return formatter.format(value);

  if (typeof value === 'string') {
    const numeric = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isNaN(numeric) ? value : formatter.format(numeric);
  }

  return value;
};


const statusVariant = (status) => {
  const n = String(status).toLowerCase();
  if (n === 'pending') return 'warning';
  if (n === 'cancelled') return 'danger';
  if (['confirmed', 'completed', 'delivered', 'preparing', 'out for delivery'].includes(n)) return 'success';
  return 'default';
};

const OrdersPage = () => {
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [dashboardData,setDashboardData]=useState(null);
  const [orders, setOrders] = useState([]);
  const[isLoading,setIsLoading]=useState(true);
  const[error,setError]=useState(" ");
  const [status, setStatus] = useState('all');
  const [payment, setPayment] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

  const handleSelectOrder = (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus || 'Pending');
    setIsStatusChanged(false);
  };
  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Parallel call dono endpoints ke liye
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/dashboard`, { method: "GET", headers: authHeaders() }),
        fetch(`${API_BASE}/api/orders`, { method: "GET", headers: authHeaders() }) // aapka getAllOrders
      ]);
  
      if (!statsRes.ok || !ordersRes.ok) throw new Error("Failed to fetch data");
  
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      
      setDashboardData(statsData.data);
      setOrders(ordersData.data || []); // Yahan saare orders array state mein save ho gaye
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const r = await fetch(`${API_BASE}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const res = await r.json();
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => o._id === id ? { ...o, orderStatus: newStatus } : o)
        );
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
        console.log('newStatus:', newStatus);
        console.log('variant:', statusVariant(newStatus));
        setOrderStatus(newStatus);
      }
    } catch (err) {
      console.error('Status update nahi hua:', err);
    }
  };
      
  useEffect(()=>{fetchDashboard();},[]);

  //card section data

  
 const orderStats = [
    { label: "Today's Orders", value: dashboardData?.todayOrders||0, color: "#FF4B3E" },
    { label: "Today's Sales", value: dashboardData?.todayRevenue||0, color: "#5B2EFF" },
    { label: "Pending", value: dashboardData?.pendingOrders||0, color: "#F59E0B" },
    { label: "Completed", value: dashboardData?.completedOrders||0, color: "#22C55E" }
  ];
  

  const columns = [
    {
      key: 'orderNumber',
      title: 'Order ID',
      render: (row) => (
        <span className={selectedOrder?.orderNumber === row.orderNumber ? 'order-id-active' : ''}>
          {row.orderNumber || row._id?.slice(-6).toUpperCase()}
        </span>
      )
    },
    { 
      key: 'customer', 
      title: 'Customer', 
      render: (row) => <span>{row.customerDetails?.name || 'Walk-in Guest'}</span> 
    },
    { 
      key: 'date', 
      title: 'Date', 
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString('en-IN')}</span> 
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (row) => <span>{formatCurrency(row.finalAmount ?? row.totalAmount)}</span>,
      align: 'right'
    },
    { key: 'payment', title: 'Payment', dataIndex: 'paymentMethod' },
    {
      key: 'status',
      title: 'Status',
      render: (row) => <StatusBadge label={row.orderStatus} variant={statusVariant(row.orderStatus)} />
    },
    {
      key: 'actions',
      title: '',
      align: 'center',
      width: 70,
      render: (row) => (
        <button
          onClick={() => handleSelectOrder(row)}
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#3b82f6',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          View
        </button>
      )
    }
          
  ];
     
      
      

  const filtered = orders.filter((order) => {
    if (!order) return false;
    const matchesStatus = status === 'all' || String(order.orderStatus).toLowerCase() === status.toLowerCase();
    const matchesPayment = payment === 'all' || String(order.paymentMethod).toLowerCase() === payment.toLowerCase();
    return matchesStatus && matchesPayment;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const paginatedItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div className="orders-page">
      <PageHeader title="Orders" subtitle="Track and manage all restaurant orders." />

      <div className="orders-grid">
        {/* ── Left: Stats + Controls + Table ── */}
        <div className="orders-left">
          <div className="orders-stats">
            {orderStats.map((stat) => (
              <div key={stat.label} className="orders-stat-card" style={{ borderLeftColor: stat.color }}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="orders-controls">
            <SearchBar placeholder="Search orders" />
            <div className="orders-filters">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Status</option> 
              <option value="Pending">Pending</option>
             <option value="Confirmed">Confirmed</option>
               <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                <option value="all">All Payments</option>
                <option value="card">Card</option>
                <option value="COD">COD</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
          </div>

          <div className="orders-table-card">
            <Table columns={columns} data={paginatedItems} />
            <Pagination 
  total={filtered.length}                    // Total elements matches current filters
  current={currentPage}                      // Active index state pointer
  pageSize={itemsPerPage}                    // Value: 5
  onPageChange={(page) => setCurrentPage(page)} // Set tracking updates on numbers click
/>
          </div>
        </div>

        {/* ── Right: Order Details Panel ── */}
        <aside className="orders-right-panel">
          <div className="order-panel">
            <div className="panel-header">
              <h3>Order Details</h3>
            </div>

            {!selectedOrder ? (
              <div className="panel-empty">
                <ClipboardList className="panel-empty-icon" />
                <p className="panel-empty-title">No order selected</p>
                <p className="panel-empty-desc">Click the view icon on any order to see details</p>
              </div>
            ) : (
              <>
                {/* ID + Status */}
                <div className="panel-section">
                  <div className="panel-order-header">
                  <span className="panel-order-id">
  {selectedOrder.orderNumber || `ORD-${selectedOrder._id?.slice(-6).toUpperCase()}`}
</span>
                    <StatusBadge label={orderStatus} variant={statusVariant(orderStatus)} />
                  </div>
                </div>

                {/* Customer */}
                <div className="panel-section">
                  <div className="panel-section-title">
                    <User size={12} />
                    <span>Customer</span>
                  </div>
                  <p className="panel-field-value">{selectedOrder.customerDetails?.name || 'Walk-in Guest'}</p>
                  <p className="panel-field-sub">{selectedOrder.customerDetails?.email || 'No email link'}</p>
                  <p className="panel-field-sub">{selectedOrder.customerDetails?.phone || 'No phone'}</p>
                </div>

                {/* Address */}
                <div className="panel-section">
                  <div className="panel-section-title">
                    <MapPin size={12} />
                    <span>Delivery Address</span>
                  </div>
                  <p className="panel-field-value">{selectedOrder.customerDetails?.address || 'Counter Pickup'}</p>
                </div>

                {/* Items */}
                <div className="panel-section">
                  <div className="panel-section-title">
                    <ShoppingBag size={12} />
                    <span>Items</span>
                  </div>
                  <div className="panel-items">
  {selectedOrder.orderedItems?.map((item, idx) => (
    <div key={idx} className="panel-item-row">
      <span className="panel-item-name">{item.name}</span>
      <span className="panel-item-qty">×{item.quantity}</span>
      <span className="panel-item-price">{formatCurrency(item.price * item.quantity)}</span>
    </div>
  ))}
</div>
                </div>

               
             {/* Summary */}
<div className="panel-section">
  <div className="panel-section-title">
    <Receipt size={12} />
    <span>Summary</span>
  </div>
  <div className="panel-summary">
    {(() => {
      const subtotal = selectedOrder.orderedItems?.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      ) || 0;
      const offerDiscount = selectedOrder.offerDiscount || 0;
      const couponDiscount = selectedOrder.couponDiscount || 0;
      const totalDiscount = offerDiscount + couponDiscount;

      return (
        <>
          <div className="panel-summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {offerDiscount > 0 && (
            <div className="panel-summary-row">
              <span>Offer Discount</span>
              <span>-{formatCurrency(offerDiscount)}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="panel-summary-row">
              <span>Coupon Discount</span>
              <span>-{formatCurrency(couponDiscount)}</span>
            </div>
          )}

          {totalDiscount > 0 && (
            <div className="panel-summary-row">
              <span>You Saved</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>
                {formatCurrency(totalDiscount)}
              </span>
            </div>
          )}

          <div className="panel-summary-row panel-summary-total">
            <span>Total</span>
            <span>{formatCurrency(selectedOrder.finalAmount ?? selectedOrder.totalAmount)}</span>
          </div>
        </>
      );
    })()}
  </div>
</div>

              
               {/* Payment */}
<div className="panel-section">
  <div className="panel-section-title">
    <CreditCard size={12} />
    <span>Payment</span>
  </div>
  <div className="panel-field-row">
    <span className="panel-field-label">Method</span>
    <span className="panel-field-value">{selectedOrder.paymentMethod}</span>
  </div>
  <div className="panel-field-row">
    <span className="panel-field-label">Status</span>
    <span className="panel-field-value" style={{
      color: selectedOrder.paymentStatus === 'paid' ? '#16a34a'
           : selectedOrder.paymentStatus === 'failed' ? '#ef4444'
           : '#f59e0b',
      textTransform: 'capitalize'
    }}>
      {selectedOrder.paymentStatus || 'pending'}
    </span>
  </div>
</div>

                {/* Status Update */}
               
               {/* ── Is Poore Section Ko Replace Kijiye ── */}
<div className="panel-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
  <label className="panel-status-label" htmlFor="panel-order-status">Update Status</label>
  
  <select
    id="panel-order-status"
    className="panel-status-select"
    value={orderStatus}
    onChange={(e) => {
      const newValue = e.target.value;
      setOrderStatus(newValue);
      // Agar status badla hai toh button active hoga
      setIsStatusChanged(newValue !== selectedOrder.orderStatus);
    }}
  >
    <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Preparing">Preparing</option>
  <option value="Out For Delivery">Out For Delivery</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
  </select>

  {/* Save Changes Button */}
  <button
    onClick={async () => {
      await handleUpdateStatus(selectedOrder._id, orderStatus);
      setIsStatusChanged(false); // Update ke baad button wapas normal
    }}
    disabled={!isStatusChanged}
    style={{
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: isStatusChanged ? 'pointer' : 'not-allowed',
      backgroundColor: isStatusChanged ? '#5b2eff' : '#e2e8f0',
      color: isStatusChanged ? '#ffffff' : '#a0aec0',
      boxShadow: isStatusChanged ? '0 4px 12px rgba(91, 46, 255, 0.2)' : 'none',
      transition: 'all 0.2s ease-in-out',
      marginTop: '5px'
    }}
  >
    Save Changes
  </button>
</div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrdersPage;
