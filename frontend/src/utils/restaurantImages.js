/**
 * Curated pool of high-quality food & restaurant images.
 * All URLs use Unsplash's direct format for reliability.
 */

export const RESTAURANT_IMAGE_POOL = [
  // Indian Dhabas & Street Food
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80', // Biryani
  'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80', // Indian curry
  // Restaurants & Dining
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', // Restaurant table
];

export const MENU_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
];

/** Simple hash to pick a consistent image from the pool given a string seed (name/_id) */
function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

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
