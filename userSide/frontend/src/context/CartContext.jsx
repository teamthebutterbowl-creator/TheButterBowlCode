/**
 * Global shopping cart — persisted in localStorage so checkout survives refresh.
 * Updated to use dish._id (MongoDB ObjectId) instead of dish.id
 */
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'butterBowlCart';

function loadCartFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or private mode */
    }
  }, [items]);

  const addItem = useCallback((dish,qty=1) => {
    const key = dish._id || dish.id;
    setItems((prev) => ({
      ...prev,
      [key]: {
        dish,
        qty: (prev[key]?.qty ?? 0) + qty,
      },
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = { ...prev };
      if (!next[id]) return prev;
      if (next[id].qty <= 1) {
        delete next[id];
      } else {
        next[id] = { ...next[id], qty: next[id].qty - 1 };
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems({}), []);

  const cartList = useMemo(() => Object.values(items), [items]);

  const total = useMemo(
    () => cartList.reduce((sum, { dish, qty }) => sum + dish.price * qty, 0),
    [cartList]
  );

  const itemCount = useMemo(
    () => cartList.reduce((sum, { qty }) => sum + qty, 0),
    [cartList]
  );

  const value = useMemo(
    () => ({
      items,
      cartList,
      total,
      itemCount,
      addItem,
      removeItem,
      clearCart,
    }),
    [items, cartList, total, itemCount, addItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
