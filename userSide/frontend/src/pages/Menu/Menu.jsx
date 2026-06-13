
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import DishCard from '../../components/DishCard/DishCard';
import styles from './Menu.module.css';
import { API_BASE } from '../../config/api';


// Categories — admin jab naye categories add kare toh
// backend se dynamic bhi kar sakte hain baad mein


export default function Menu() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);

  // Fetch all products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch only available products
        const res = await fetch(`${API_BASE}/api/products?isAvailable=true`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load menu');
        }

        setProducts(data.data);
      } catch (err) {
        console.error('Menu fetch error:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  //fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(['All', ...data.data.map((c) => c.name)]);
        }
      } catch (err) {
        console.error('Categories fetch error:', err);
      }
    };
    fetchCategories();
  }, []);
  

  // Filter products by category on frontend (no extra API call needed)
  const filtered = useMemo(
    () =>
      category === 'All'
        ? products
        : products.filter((p) => p.category?.name === category),
    [category, products]
  );

  useEffect(() => {
    fetch(`${API_BASE}/offers/active`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setActiveOffers(data.data); })
      .catch(() => {});
  }, []);
  
  // Dish ke liye matching offer dhundo
  const getOfferForDish = (dish) => {
    return activeOffers.find((offer) => {
      if (offer.scope === 'menu') return true;
      if (offer.scope === 'product') {
        return offer.applicableProducts?.some(
          (p) => (p._id || p).toString() === dish._id.toString()
        );
      }
      if (offer.scope === 'category') {
        return offer.applicableCategories?.some(
          (c) => (c._id || c).toString() === (dish.category?._id || dish.category)?.toString()
        );
      }
      return false;
    }) || null;
  };

  // Navigate to product detail page on card click
  const handleCardClick = (productId) => {
    console.log('Navigating to product ID:', productId, 'Length:', productId.length);
    navigate(`/menu/${productId}`);
  };

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="section-label">Culinary Collection</span>
          <h1>Our Menu</h1>
          <p>
            Curated North Indian classics, prepared with premium ingredients and
            timeless technique.
          </p>
        </div>
      </header>

      <section className={`section ${styles.menu}`}>
        <div className="container">

          {/* Category filter */}
          <FilterBar categories={categories} active={category} onChange={setCategory} />

          {/* Loading state */}
          {isLoading && (
            <div className={styles.centerState}>
              <p>Loading menu...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className={styles.centerState}>
              <p className={styles.errorText}>⚠️ {error}</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filtered.length === 0 && (
            <div className={styles.centerState}>
              <p>No items found in this category.</p>
            </div>
          )}
          {/* Trending Deals Section */}
{activeOffers.length > 0 && (
  <div className={styles.dealsSection}>
    <h2 className={styles.dealsTitle}>🔥 Today's Deals</h2>
    <div className={styles.dealCards}>
      {activeOffers.map((offer) => (
        <div key={offer._id} className={styles.dealCard}>
          <div className={styles.dealBadge}>
            {offer.discountType === 'percentage'
              ? `${offer.discountValue}% OFF`
              : `Flat ₹${offer.discountValue} OFF`}
          </div>
          <div className={styles.dealInfo}>
            <h3 className={styles.dealName}>{offer.title}</h3>
            {offer.description && (
              <p className={styles.dealDesc}>{offer.description}</p>
            )}
            {offer.minimumOrder && (
              <span className={styles.dealMin}>
                Min. order ₹{offer.minimumOrder}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          {/* Products grid */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className={styles.grid}>
              {filtered.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  onClick={() => handleCardClick(dish._id)}
                  offer={getOfferForDish(dish)}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
/* Append to Menu.module.css — add these states */
