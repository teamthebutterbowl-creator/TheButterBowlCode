import React, { useState,useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader/PageHeader';
import Table from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import Tabs from '../../components/shared/Tabs/Tabs';
import FormInput from '../../components/common/Input/FormInput';
import SelectInput from '../../components/common/Input/SelectInput';
import TextArea from '../../components/common/Input/TextArea';

import StatusBadge from '../../components/shared/StatusBadge/StatusBadge';
import './OffersPage.css';
const API = import.meta.env.VITE_API_BASE_URL ;
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const INITIAL_FORM = {
  title: '',
  description: '',
  offerType: 'seasonal',
  discountType: 'percentage',
  discountValue: '',
  minimumOrder: '',
  maximumDiscount: '',
  startDate: '',
  endDate: '',
  isActive: true,
  totalUsageLimit: '',
  usagePerCustomer: '',
  minimumCartValue: '',
  scope: 'menu',
applicableProducts: [],
applicableCategories: [],
};

const INITIAL_COUPON_FORM = {
  code: '',
  type: 'percentage',
  value: '',
  expiryDate: '',
  minimumOrder: '',
maximumDiscount: '',
startDate: '',
endDate: '',
totalUsageLimit: '',
};


const getAllOffers = async () => {
  const r = await fetch(`${API}/offers`, { headers: authHeader() });
  return r.json();
};

const createOffer = async (data) => {
  const r = await fetch(`${API}/offers`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return r.json();
};

const updateOffer = async (id, data) => {
  const r = await fetch(`${API}/offers/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return r.json();
};

const toggleOfferStatus = async (id) => {
  const r = await fetch(`${API}/offers/${id}/toggle`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return r.json();
};

const deleteOffer = async (id) => {
  const r = await fetch(`${API}/offers/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return r.json();
};
const getAllCoupons = async () => {
  const r = await fetch(`${API}/api/coupons`, { headers: authHeader() });
  return r.json();
};

const createCoupon = async (data) => {
  const r = await fetch(`${API}/api/coupons`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return r.json();
};

const updateCoupon = async (id, data) => {
  const r = await fetch(`${API}/api/coupons/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return r.json();
};

const toggleCouponStatus = async (id) => {
  const r = await fetch(`${API}/api/coupons/${id}/toggle`, {
    method: "PATCH",
    headers: authHeader(),
  });
  return r.json();
};

const deleteCoupon = async (id) => {
  const r = await fetch(`${API}/api/coupons/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return r.json();
};


const Toast = ({ message, type }) => (
  <div style={{
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: type === 'success' ? '#16a34a' : '#dc2626',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }}>
    {type === 'success' ? '✅' : '❌'} {message}
  </div>
);
 
  

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState('details');

  // ---------------------
  // Offers state
  // ---------------------
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState(null);

  // ---------------------
  // Form state
  // ---------------------
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null); // null = create mode, id = edit mode
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);


  const [coupons, setCoupons] = useState([]);
const [couponsLoading, setCouponsLoading] = useState(false);

const [couponForm, setCouponForm] = useState(INITIAL_COUPON_FORM);
const [editingCouponId, setEditingCouponId] = useState(null);
const [couponFormLoading, setCouponFormLoading] = useState(false);
const [toast, setToast] = useState(null);
const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);

const showToast = (message, type = 'success') => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};
   // ---------------------
  // Fetch all offers on mount
  // ---------------------
  useEffect(() => {
    fetchOffers();
    fetchCoupons();
    fetchCategories();
    fetchProducts();
  }, []);


  const fetchOffers = async () => {
    setOffersLoading(true);
    setOffersError(null);
    try {
      const res = await getAllOffers();
      setOffers(res.data || []);
    } catch (err) {
      showToast('Failed to load Offers.','error');
    } finally {
      setOffersLoading(false);
    }
  };
  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await getAllCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      showToast('Failed to load coupons','error');
    } finally {
      setCouponsLoading(false);
    }
  };
 
  const fetchCategories = async () => {
    try {
      const r = await fetch(`${API}/api/categories`);
      const data = await r.json();
      setCategories(data.data || []);
    } catch (err) {
      showToast('Failed to load categories', 'error');
    }
  };
  
  const fetchProducts = async () => {
    try {
      const r = await fetch(`${API}/api/products?limit=50`, { headers: authHeader() });
      const data = await r.json();
      setProducts(data.data || []);
    } catch (err) {
      showToast('Failed to load products', 'error');
    }
  };
       // ---------------------
  // Form handlers
  // ---------------------
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleEditClick = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      offerType: offer.offerType || 'seasonal',
      discountType: offer.discountType || 'percentage',
      discountValue: offer.discountValue || '',
      minimumOrder: offer.minimumOrder || '',
      maximumDiscount: offer.maximumDiscount || '',
      startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
      endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
      isActive: offer.isActive,
      totalUsageLimit: offer.totalUsageLimit || '',
      usagePerCustomer: offer.usagePerCustomer || '',
      minimumCartValue: offer.minimumCartValue || '',
      scope: offer.scope || 'menu',
    applicableProducts: offer.applicableProducts?.map(p => p._id || p) || [],
    applicableCategories: offer.applicableCategories?.map(c => c._id || c) || [],
    });
    setActiveTab('details');
    setFormError(null);
    setFormSuccess(null);
  };

 
  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSaveOffer = async () => {
    if (!form.title.trim()) {
      showToast('offer title required');
      return;
    }

    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (editingId) {
        // UPDATE
        await updateOffer(editingId, form);
        showToast('Offer has updated!');
      } else {
        // CREATE
        await createOffer(form);
        showToast('new offer has been created');
      }
      setForm(INITIAL_FORM);
      setEditingId(null);
      fetchOffers(); // Refresh list
    } catch (err) {
      showToast(err?.response?.data?.message || 'try again , something went wrong.','error');
    } finally {
      setFormLoading(false);
    }
  };
  const handleToggleStatus = async (offer) => {
    try {
      await toggleOfferStatus(offer._id);
      fetchOffers();
    } catch (err) {
      showToast('Failed to toggle.','error');
    }
  };

  const handleDelete = async (offer) => {
    if (!window.confirm(`"${offer.title}" Really want to delete?`)) return;
    try {
      await deleteOffer(offer._id);
      fetchOffers();
    } catch (err) {
      showToast('Not deleted , Try again','error');
    }
  };


  const handleCouponChange = (field, value) => {
    setCouponForm((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleCouponEditClick = (coupon) => {
    setEditingCouponId(coupon._id);
    setCouponForm({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: coupon.value || '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
    });
    setActiveTab('coupon');
  };
  
  const handleCouponCancel = () => {
    setCouponForm(INITIAL_COUPON_FORM);
    setEditingCouponId(null);
  };
  
  const handleSaveCoupon = async () => {
    if (!couponForm.code.trim()) {
      showToast('Coupon code is required ', 'error');
      return;
    }
    setCouponFormLoading(true);
    try {
      if (editingCouponId) {
        await updateCoupon(editingCouponId, couponForm);
        showToast('Coupon updated!');
      } else {
        await createCoupon(couponForm);
        showToast('coupon created !');
      }
      setCouponForm(INITIAL_COUPON_FORM);
      setEditingCouponId(null);
      fetchCoupons();
    } catch (err) {
      showToast('Kuch galat hua.', 'error');
    } finally {
      setCouponFormLoading(false);
    }
  };
  
  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm(`"${coupon.code}" really want to delete ?`)) return;
    try {
      await deleteCoupon(coupon._id);
      fetchCoupons();
      showToast('Coupon deleted!');
    } catch (err) {
      showToast('not deleted , try again!.', 'error');
    }
  };
  
  const handleToggleCoupon = async (coupon) => {
    try {
      await toggleCouponStatus(coupon._id);
      fetchCoupons();
    } catch (err) {
      showToast('failed to toggle status.', 'error');
    }
  };



  const offerColumns = [
    { key: 'id', title: 'Offer ID', render: (row) => row._id?.slice(-6).toUpperCase() },
    { key: 'title', title: 'Title', dataIndex: 'title' },
    { key: 'status', title: 'Status', render: (row) => <StatusBadge label={row.isActive ? 'Active' : 'Inactive'} variant={row.isActive ? 'success' : 'warning'} /> },
    { key: 'discount', title: 'Discount', render: (row) => row.discountValue ? `${row.discountValue}${row.discountType === 'percentage' ? '%' : '₹'}` : '—' },
    { key: 'valid', title: 'Valid Until', render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString('en-IN') : '—' },
    {
      key: 'actions', title: 'Actions', render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleEditClick(row)}>Edit</button>
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleToggleStatus(row)}>{row.isActive ? 'Deactivate' : 'Activate'}</button>
          <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleDelete(row)}>Delete</button>
        </div>
      )
    },
  ];
  

  const couponColumns = [
    { key: 'id', title: 'Coupon ID', render: (row) => row._id?.slice(-6).toUpperCase() },
    { key: 'code', title: 'Code', dataIndex: 'code' },
    { key: 'type', title: 'Type', render: (row) => row.type === 'percentage' ? 'Percentage' : 'Fixed Amount' },
    { key: 'value', title: 'Value', render: (row) => row.type === 'percentage' ? `${row.value}%` : `₹${row.value}` },
    { key: 'expiry', title: 'Expiry', render: (row) => row.expiryDate ? new Date(row.expiryDate).toLocaleDateString('en-IN') : '—' },
    {
      key: 'status', title: 'Status',
      render: (row) => <StatusBadge label={row.isActive ? 'Active' : 'Inactive'} variant={row.isActive ? 'success' : 'warning'} />
    },
    {
      key: 'actions', title: 'Actions', render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleCouponEditClick(row)}>Edit</button>
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleToggleCoupon(row)}>{row.isActive ? 'Deactivate' : 'Activate'}</button>
          <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleDeleteCoupon(row)}>Delete</button>
        </div>
      )
    },
  ];

  return (
    <div className="offers-page">
      <PageHeader title="Offers & Coupons" subtitle="Create and manage promotional campaigns with live preview, limits and coupon settings." />
      <div className="offers-grid">
        <div className="offers-left">
          <div className="offer-summary-row">
            <div className="offer-card offer-card-primary">
              <span>Total Offers</span>
              <strong>{offersLoading ? '...' : offers.length}</strong>
            </div>
            <div className="offer-card offer-card-secondary">
              <span>Active Offers</span>
              <strong>{offers.filter((o) => o.isActive).length}</strong>
            </div>
          </div>
          <div className="offers-data-card">
            <div className="data-card-title">
              <h3>Offer List</h3>
            </div>
            <Table columns={offerColumns} data={offers} />
            <Pagination total={3} onPageChange={() => {}} />
          </div>
          <div className="offers-data-card">
            <div className="data-card-title">
              <h3>Coupon Table</h3>
            </div>
            <Table columns={couponColumns} data={coupons}  />
            <Pagination total={2} onPageChange={() => {}} />
          </div>
        </div>
        <aside className="offers-right-panel">
          <div className="offer-form-card">
            <Tabs
  tabs={[
    { key: 'details', label: 'Offer Details' },
    { key: 'coupon', label: 'Coupon Settings' },
  
  ]}
  onChange={setActiveTab}
/>

{activeTab === 'details' && (
  <>
    <div className="offer-form-body">
    <FormInput label="Offer Title" placeholder="Enter offer name"
  value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
   
   <TextArea label="Offer Description" placeholder="Describe the campaign details." rows={4}
  value={form.description} onChange={(e) => handleChange('description', e.target.value)} />

    
<SelectInput label="Offer Type" value={form.offerType}
  onChange={(val) => handleChange('offerType', val)}
  options={[{ value: 'seasonal', label: 'Seasonal' }, { value: 'holiday', label: 'Holiday' }]} />

<SelectInput label="Offer Scope" value={form.scope}
  onChange={(val) => handleChange('scope', val)}
  options={[
    { value: 'menu', label: 'Entire Menu' },
    { value: 'category', label: 'By Category' },
    { value: 'product', label: 'By Product' },
  ]} />

{form.scope === 'category' && (
  <div>
    <label className="input-label">Select Categories</label>
    <select multiple
      value={form.applicableCategories}
      onChange={(e) => handleChange('applicableCategories',
        Array.from(e.target.selectedOptions, o => o.value))}
      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '100px' }}
    >
      {categories.map((c) => (
        <option key={c._id} value={c._id}>{c.name}</option>
      ))}
    </select>
  </div>
)}

{form.scope === 'product' && (
  <div>
    <label className="input-label">Select Products</label>
    <select multiple
      value={form.applicableProducts}
      onChange={(e) => handleChange('applicableProducts',
        Array.from(e.target.selectedOptions, o => o.value))}
      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '100px' }}
    >
      {products.map((p) => (
        <option key={p._id} value={p._id}>{p.name}</option>
      ))}
    </select>
  </div>
)}

<SelectInput label="Discount Type" value={form.discountType}
  onChange={(val) => handleChange('discountType', val)}
  options={[{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed Amount' }]} />


<FormInput label="Discount Value" placeholder="25"
  value={form.discountValue} onChange={(e) => handleChange('discountValue', e.target.value)} />

<FormInput label="Minimum Order" placeholder="30"
  value={form.minimumOrder} onChange={(e) => handleChange('minimumOrder', e.target.value)} />

<FormInput label="Maximum Discount" placeholder="50"
  value={form.maximumDiscount} onChange={(e) => handleChange('maximumDiscount', e.target.value)} />

<div className="date-row">
  <input type="date" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
  <input type="date" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
</div>


    </div>

    <div className="offer-form-footer">
    <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
<button type="button" className="btn btn-primary" onClick={handleSaveOffer} disabled={formLoading}>
  {formLoading ? 'Saving...' : editingId ? 'Update Offer' : 'Save Offer'}
</button>
    </div>
  </>
)}

{activeTab === 'coupon' && (
  <>
    <div className="offer-form-body">
      <FormInput label="Coupon Code" placeholder="SAVE20"
        value={couponForm.code}
        onChange={(e) => handleCouponChange('code', e.target.value.toUpperCase())} />

      <SelectInput label="Coupon Type" value={couponForm.type}
        onChange={(val) => handleCouponChange('type', val)}
        options={[
          { value: 'percentage', label: 'Percentage' },
          { value: 'fixed', label: 'Fixed Amount' },
        ]} />

      <FormInput label="Coupon Value" placeholder="20"
        value={couponForm.value}
        onChange={(e) => handleCouponChange('value', e.target.value)} />

      <div className="date-row">
        <div>
          <label className="input-label">Expiry Date</label>
          <input type="date" value={couponForm.expiryDate}
            onChange={(e) => handleCouponChange('expiryDate', e.target.value)} />
        </div>
      </div>
      <FormInput label="Minimum Order" placeholder="199"
  value={couponForm.minimumOrder}
  onChange={(e) => handleCouponChange('minimumOrder', e.target.value)} />

<FormInput label="Maximum Discount" placeholder="100"
  value={couponForm.maximumDiscount}
  onChange={(e) => handleCouponChange('maximumDiscount', e.target.value)} />

<FormInput label="Total Usage Limit" placeholder="500"
  value={couponForm.totalUsageLimit}
  onChange={(e) => handleCouponChange('totalUsageLimit', e.target.value)} />

<div className="date-row">
  <div>
    <label className="input-label">Start Date</label>
    <input type="date" value={couponForm.startDate}
      onChange={(e) => handleCouponChange('startDate', e.target.value)} />
  </div>
  <div>
    <label className="input-label">End Date</label>
    <input type="date" value={couponForm.endDate}
      onChange={(e) => handleCouponChange('endDate', e.target.value)} />
  </div>
</div>
    </div>

    <div className="offer-form-footer">
      <button type="button" className="btn btn-outline" onClick={handleCouponCancel}>
        {editingCouponId ? 'Cancel Edit' : 'Reset'}
      </button>
      <button type="button" className="btn btn-primary" onClick={handleSaveCoupon} disabled={couponFormLoading}>
        {couponFormLoading ? 'Saving...' : editingCouponId ? 'Update Coupon' : 'Save Coupon'}
      </button>
    </div>
    {toast && <Toast message={toast.message} type={toast.type} />}
  </>
)}


          </div>
        </aside>
      </div>
    </div>
  );
};

export default OffersPage;

