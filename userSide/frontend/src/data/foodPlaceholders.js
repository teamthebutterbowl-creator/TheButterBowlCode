/** Local and verified image paths — served from /public/assets (no broken Unsplash IDs). */

export const DEFAULT_FOOD_IMAGE = '/Image4.jpeg';

/** Category-level fallbacks in /public/assets/menu */
export const categoryPlaceholders = {
  Starters: '/assets/menu/starters.jpg',
  'Main Course': '/assets/menu/main-course.jpg',
  Breads: '/assets/menu/breads.jpg',
  Rice: '/assets/menu/rice.jpg',
  Desserts: '/assets/menu/desserts.jpg',
  Beverages: '/assets/menu/beverages.jpg',
};

/** Per-dish images (local assets; category fallback if missing) */
export const dishImages = {
  'samosa-chaat': categoryPlaceholders.Starters,
  'paneer-tikka': categoryPlaceholders.Starters,
  'tandoori-prawns': categoryPlaceholders.Starters,
  'butter-chicken': "/Image1.jpeg",
  'paneer-makhani': "/Image2.jpeg",
  'dal-makhani': "/Image3.jpeg",
  'kadhai-paneer': "/Image4.jpeg",
  'lamb-rogan-josh': "/Image4.jpeg",
  'butter-naan': categoryPlaceholders.Breads,
  'garlic-naan': categoryPlaceholders.Breads,
  'lachha-paratha': categoryPlaceholders.Breads,
  biryani: categoryPlaceholders.Rice,
  'jeera-rice': categoryPlaceholders.Rice,
  'gulab-jamun': categoryPlaceholders.Desserts,
  rasmalai: categoryPlaceholders.Desserts,
  'masala-chai': categoryPlaceholders.Beverages,
  lassi: categoryPlaceholders.Beverages,
  'restaurant-interior': "/Image4.jpeg",
};

export function getDishImage(dish) {
  if (!dish) return DEFAULT_FOOD_IMAGE;
  if (dishImages[dish.id]) return dishImages[dish.id];
  if (dish.category && categoryPlaceholders[dish.category]) {
    return categoryPlaceholders[dish.category];
  }
  return DEFAULT_FOOD_IMAGE;
}

export function resolveFoodImage(src, category) {
  if (src?.startsWith('/assets/')) return src;
  if (category && categoryPlaceholders[category]) {
    return categoryPlaceholders[category];
  }
  return DEFAULT_FOOD_IMAGE;
}
