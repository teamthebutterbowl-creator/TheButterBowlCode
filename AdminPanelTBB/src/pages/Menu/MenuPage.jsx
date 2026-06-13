
import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/shared/PageHeader/PageHeader';
import SearchBar from '../../components/shared/SearchBar/SearchBar';
import Table from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import Tabs from '../../components/shared/Tabs/Tabs';
import FormInput from '../../components/common/Input/FormInput';
import SelectInput from '../../components/common/Input/SelectInput';
import TextArea from '../../components/common/Input/TextArea';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import StatusBadge from '../../components/shared/StatusBadge/StatusBadge';
import './MenuPage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const MenuPage = () => {
  const [category, setCategory] = useState('all');
  const [tab, setTab] = useState('general');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Add Category modal
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Panel mode - add ya edit
  const [panelMode, setPanelMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', isAvailable: 'yes',
    description: '', fullDescription: '', images: []
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // ── Fetch categories ──
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      console.log("data is ",data);
      if (data.success) setCategories(data.data);
    } catch {}
  }, []);

  // ── Fetch products ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 10 });
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`${API_BASE}/api/products?${params}`, { headers: authHeaders() });
      const data = await res.json();
      console.log("FIRST PRODUCT:", JSON.stringify(data.data[0], null, 2));
      console.log(data);
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pages);
      }
    } catch {}
    setLoading(false);
  }, [category, search, currentPage]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setCurrentPage(1); }, [category, search]);

  // ── Category pills ──
  const categoryPills = [
    { key: 'all', label: 'All' },
    ...categories.map((c) => ({ key: c._id, label: c.name }))
  ];

  // ── Table columns ──
  const columns = [
    {
      key: 'image', title: 'Image',
      render: (row) => row.images?.[0]
        ? <img src={row.images[0]} alt={row.name} className="menu-image" />
        : <div className="menu-image">🍔</div>
    },
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'category', title: 'Category', render: (row) => row.category?.name ?? '—' },
    { key: 'price', title: 'Price', render: (row) => `₹${row.price}` },
    {
      key: 'status', title: 'Status',
      render: (row) => <StatusBadge label={row.isAvailable ? 'Active' : 'Inactive'} variant={row.isAvailable ? 'success' : 'danger'} />
    },
    { key: 'available', title: 'Availability', render: (row) => row.isAvailable ? 'Yes' : 'No' },
    {
      key: 'actions', title: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="ghost-button"
            onClick={() => {
              setPanelMode('edit');
              setEditingId(row._id);
              setFormData({
                name: row.name ?? '',
                category:
                  typeof row.category === "object"
                    ? row.category._id
                    : row.category?._id || row.category || '',
                price: row.price ?? '',
                isAvailable: row.isAvailable ? 'yes' : 'no',
                description: row.description ?? '',
                fullDescription: row.fullDescription ?? '',
                images: row.images ?? []
              });
              setFormError('');
              setTab('general');
            }}
          >
            Edit
          </button>
          <button
            className="ghost-button"
            style={{ color: row.isAvailable ? 'var(--color-text-danger)' : 'var(--color-text-success)' }}
            onClick={() => handleToggleAvailability(row._id)}
          >
            {row.isAvailable ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];
  const handleToggleAvailability = async (id) => {
    try {
      await fetch(`${API_BASE}/api/products/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: authHeaders()
      });
      fetchProducts();
    } catch {}
  };
  //for soft delete 
  const handleDeactivateProduct = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this item?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      console.log("DELETE RESPONSE:", data); // ← yeh log karo
      fetchProducts();
    } catch {}
  };
  // ── Add Category ──
  const handleAddCategory = async () => {
    setCategoryError('');
    if (!newCategoryName.trim()) { setCategoryError('Category name is required.'); return; }
    setCategoryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await res.json();
      if (!res.ok) { setCategoryError(data.message || 'Failed to add category.'); return; }
      setNewCategoryName('');
      setShowModal(false);
      fetchCategories();
    } catch {
      setCategoryError('Connection error. Please try again.');
    }finally{
    setCategoryLoading(false);
    }
  };
  //handle add product
  const handleAddProduct = async () => {
    setFormError("");
  
    if (!formData.name || !formData.category || !formData.price) {
      setFormError("Name, Category and Price are required.");
      return;
    }
  
    setFormLoading(true);
  
    try {
      const body = new FormData();
  
      body.append("name", formData.name);
      body.append("category", formData.category);
      body.append("price", formData.price);
      body.append(
        "isAvailable",
        formData.isAvailable === "yes" ? "true" : "false"
      );
  
      if (formData.description) {
        body.append("description", formData.description);
      }
  
      if (formData.fullDescription) {
        body.append("fullDescription", formData.fullDescription);
      }
  
      if (formData.images?.[0] instanceof File) {
        body.append("image", formData.images[0]);
      }
  
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: authHeaders(),
        body,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setFormError(data.message || "Failed to create product");
        return;
      }
  
      setFormData({
        name: "",
        category: "",
        price: "",
        isAvailable: "yes",
        description: "",
        fullDescription: "",
        images: [],
      });
  
      fetchProducts();
    } catch {
      setFormError("Connection error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    setFormError("");
    setFormLoading(true);
  
    try {
      const body = new FormData();
  
      // 🔥 SAFE CATEGORY HANDLING (MAIN FIX)
      const categoryId =
        formData.category && typeof formData.category === "object"
          ? formData.category._id
          : formData.category;
  
      console.log("CATEGORY BEFORE SEND:", formData.category);
      console.log("CATEGORY ID SENT:", categoryId);
  
      // name (optional in update)
      if (formData.name) {
        body.append("name", formData.name);
      }
  
      // category (IMPORTANT)
      if (categoryId) {
        body.append("category", categoryId);
      }
  
      // price
      if (formData.price) {
        body.append("price", formData.price);
      }
  
      // availability
      body.append(
        "isAvailable",
        formData.isAvailable === "yes" ? "true" : "false"
      );
  
      // description
      if (formData.description) {
        body.append("description", formData.description);
      }
  
      // full description
      if (formData.fullDescription) {
        body.append("fullDescription", formData.fullDescription);
      }
  
      // image (single)
      if (formData.images?.[0] instanceof File) {
        body.append("image", formData.images[0]);
      }
  
      const res = await fetch(
        `${API_BASE}/api/products/${editingId}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body,
        }
      );
  
      const data = await res.json();
  
      if (!res.ok) {
        setFormError(data.message || "Failed to update product");
        return;
      }
  
      // reset
      setPanelMode("add");
      setEditingId(null);
  
      setFormData({
        name: "",
        category: "",
        price: "",
        isAvailable: "yes",
        description: "",
        fullDescription: "",
        images: [],
      });
  
      fetchProducts();
    } catch (err) {
      console.error(err);
      setFormError("Connection error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Want to delete category?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) fetchCategories();
    } catch {}
  };

  return (
    <div className="menu-page">
      <PageHeader title="Menu Management" subtitle="Manage your menu categories, pricing and availability with real-time admin controls." />
      <div className="menu-grid">
        <div className="menu-left">
          <div className="menu-toolbar">
            <SearchBar
              placeholder="Search menu items"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="menu-actions">
            <button
    type="button"
    className="btn btn-outline"
 
    onClick={() => {
      console.log("ADD CATEGORY FIRED");
      setNewCategoryName('');
      setCategoryError('');
      setShowModal(true);
    }}
  >
    Add Category
  </button>
              <button type="button" className="btn btn-primary" onClick={() => {
                setPanelMode('add');
                setEditingId(null);
                setFormData({ name: '', category: '', price: '', isAvailable: 'yes', description: '', fullDescription: '', images: [] });
                setFormError('');
                setTab('general');
              }}>Add New Item</button>
            </div>
          </div>
          <div className="menu-filters">
            {/* {categoryPills.map((item) => (
              <button key={item.key} type="button"
                className={item.key === category ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setCategory(item.key)}>
                {item.label}
              </button>
            ))} */}
            {categoryPills.map((item) => (
  <div key={item.key} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
    <button
      type="button"
      className={item.key === category ? 'filter-pill active' : 'filter-pill'}
      onClick={() => setCategory(item.key)}
    >
      {item.label}
    </button>
    {item.key !== 'all' && (
      <button
        type="button"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '14px', padding: '0 4px' }}
        onClick={() => handleDeleteCategory(item.key)}
        title="Delete category"
      >
        ×
      </button>
    )}
  </div>
))}
          </div>
          <div className="menu-table-card">
            <Table columns={columns} data={products} />
            <Pagination total={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>

        <aside className="menu-right-panel">
          <div className="editor-card">
            <Tabs
              tabs={[
                { key: 'general', label: 'General' },
              
              ]}
              onChange={setTab}
            />
            <div className="editor-body">
              {formError && <p style={{ color: 'red', fontSize: '13px', marginBottom: '8px' }}>{formError}</p>}
              <FormInput label="Item Name" placeholder="Enter menu title"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
            <SelectInput
  label="Category"
  value={formData.category || ""}
  onChange={(value) => {
    console.log("CATEGORY RAW VALUE:", value);
    setFormData((p) => ({ ...p, category: value }));
  }}
  options={categories.map((c) => ({
    value: c._id,
    label: c.name,
  }))}
/>
              <FormInput label="Price" placeholder="$12.00"
                value={formData.price}
                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} />
              <SelectInput label="Availability" value={formData.isAvailable}
               onChange={(value) => setFormData(p => ({ ...p, isAvailable: value }))}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              <TextArea label="Short Description" placeholder="Add a short item description."
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
              <TextArea label="Full Description" placeholder="Add detailed menu information." rows={6}
                value={formData.fullDescription}
                onChange={(e) => setFormData(p => ({ ...p, fullDescription: e.target.value }))} />
              <ImageUploader
  label="Item Images"
  onChange={(e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));

    console.log("Selected files:", files);
  }}
/>
            </div>
            <div className="editor-footer">
              <button type="button" className="btn btn-outline" onClick={() => {
                setPanelMode('add');
                setFormData({ name: '', category: '', price: '', isAvailable: 'yes', description: '', fullDescription: '', images: [] });
                setFormError('');
              }}>Cancel</button>
              <button type="button" className="btn btn-primary" disabled={formLoading}  onClick={
    panelMode === "add"
      ? handleAddProduct
      : handleUpdateProduct
  }>
                {formLoading ? 'Saving...' : panelMode === 'add' ? 'Add Item' : 'Update Item'}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Add Category Modal */}
  {/* 💡 Update code: Sirf tab render hoga jab showModal true hoga */}
{showModal && (
  <div className="modal-overlay open" onClick={() => setShowModal(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <h3>Add Category</h3>
      <FormInput 
        label="Category Name" 
        placeholder="e.g. Burgers, Desserts"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)} 
      />
      {categoryError && <p style={{ color: 'red', fontSize: '13px' }}>{categoryError}</p>}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button 
          type="button" // Extra safety standard
          className="btn btn-outline" 
          onClick={() => setShowModal(false)} 
          disabled={categoryLoading}
        >
          Cancel
        </button>
        <button 
          type="button"
          className="btn btn-primary" 
          onClick={handleAddCategory} 
          disabled={categoryLoading}
        >
          {categoryLoading ? 'Adding...' : 'Add Category'}
        </button>
      </div>
    </div>
  </div>
)}
  




    </div>
    
  );
};

export default MenuPage;