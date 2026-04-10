const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const RESTAURANT_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
];

export const MENU_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=600',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600',
];

const BROKEN_PATTERNS = [
  'no-photo',
  'placeholder',
  'undefined',
  'null',
  'default',
  'localhost',
];

function isBroken(url) {
  if (!url || typeof url !== 'string') return true;
  return BROKEN_PATTERNS.some(p => url.toLowerCase().includes(p));
}

/**
 * Returns a reliable Unsplash image URL for a restaurant.
 * Picks consistently from the pool based on the restaurant's _id or name.
 */
export function getRestaurantImage(restaurant = {}) {
  const { image, _id, name } = restaurant;
  if (!isBroken(image) && image.startsWith('http')) return image;
  const seed = _id || name || Math.random().toString();
  return RESTAURANT_IMAGE_POOL[hashString(seed) % RESTAURANT_IMAGE_POOL.length];
}

/**
 * Returns a reliable image URL for a menu item.
 */
export function getMenuItemImage(item = {}) {
  const { image, _id, name } = item;
  if (!isBroken(image) && image.startsWith('http')) return image;
  const seed = _id || name || Math.random().toString();
  return MENU_IMAGE_POOL[hashString(seed) % MENU_IMAGE_POOL.length];
}