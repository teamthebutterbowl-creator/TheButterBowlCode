
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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


  //Optimized all the api with the help of promise all
  useEffect(()=>{
    const fetchAll=async()=>{
      setIsLoading(true)//because data is not received yet 
     try{
      const[prodRes,catRes,offerRes]=await Promise.all([
        fetch(`${API_BASE}/api/products?isAvailable=true`),
        fetch(`${API_BASE}/api/categories`),
        fetch(`${API_BASE}/offers/active`),
      ])
      const[prodData,catData,offerData]=await Promise.all([
        prodRes.json(),
        catRes.json(),
        offerRes.json()
      ])
      setProducts(prodData.data||[])
     setCategories(['All', ...catData.data.map((c) => c.name)])
     setActiveOffers(offerData.data||[])

     }catch(err){
       console.error('Menu fetch error:', err.message);
        setError(err.message);
     }finally{
      setIsLoading(false)
     }

    }
    fetchAll();

  },[])

  

  // Filter products by category on frontend (no extra API call needed)
  const filtered = useMemo(
    () =>
      category === 'All'
        ? products
        : products.filter((p) => p.category?.name === category),
    [category, products]
  );

  const productOfferMap = useMemo(() => {
  const map = new Map();

  activeOffers.forEach((offer) => {
    if (offer.scope === 'product') {
      offer.applicableProducts?.forEach((p) => {
        map.set((p._id || p).toString(), offer);
      });
    }
  });

  return map;
}, [activeOffers]);

const categoryOfferMap = useMemo(() => {
  const map = new Map();

  activeOffers.forEach((offer) => {
    if (offer.scope === 'category') {
      offer.applicableCategories?.forEach((c) => {
        map.set((c._id || c).toString(), offer);
      });
    }
  });

  return map;
}, [activeOffers]);


  // Dish ke liye matching offer dhundo
const getOfferForDish = (dish) => {
  // 1. product-level (highest priority)
  const productOffer = productOfferMap.get(dish._id);
  if (productOffer) return productOffer;

  // 2. category-level
  const categoryId = dish.category?._id || dish.category;
  const categoryOffer = categoryOfferMap.get(categoryId);
  if (categoryOffer) return categoryOffer;

  // 3. menu-level fallback
  const menuOffer = activeOffers.find((o) => o.scope === 'menu');
  if (menuOffer) return menuOffer;

  return null;
};

  // Navigate to product detail page on card click
  const handleCardClick = (productId) => {
    console.log('Navigating to product ID:', productId, 'Length:', productId.length);
    navigate(`/menu/${productId}`);
  };

  return (
    <>
     <Helmet>
  <title>Butter Bowl – North Indian Cloud Kitchen | Order Online</title>
  <meta name="description" content="Order fresh North Indian food online from Butter Bowl. Biryanis, curries, breads and more — delivered hot to your door." />
  <meta property="og:title" content="Butter Bowl – Order Fresh North Indian Food" />
  <meta property="og:description" content="Fresh North Indian meals delivered fast. Explore our menu and order now." />
  <meta property="og:image" content="https://thebutterbowl.in/Image1.jpeg" />
  <meta property="og:url" content="https://thebutterbowl.in/" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://thebutterbowl.in/" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Butter Bowl – North Indian Cloud Kitchen" />
  <meta name="twitter:description" content="Fresh North Indian meals delivered fast. Order now from Butter Bowl." />
  <meta name="twitter:image" content="https://thebutterbowl.in/Image1.jpeg" />
</Helmet>


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
    <h2 className={styles.dealsTitle}>  Today's Special Offers</h2>
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
