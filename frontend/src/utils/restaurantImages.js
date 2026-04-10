/**
 * Curated pool of high-quality food & restaurant images.
 * All URLs use Unsplash's direct format for reliability.
 */

export const RESTAURANT_IMAGE_POOL = [
  // Indian Dhabas & Street Food
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', // Biryani in pot
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80', // Dal makhani spread
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80', // Paneer tikka
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80', // Indian thali
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', // Butter chicken
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80', // Masala dosa
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', // Samosa & chai
  'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&q=80', // Indian street food
  // Restaurants & Dining
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', // Fine dining
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', // Restaurant interior
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Restaurant ambience
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80', // Cozy cafe
  // Food close-ups
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', // Mixed food spread
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', // Pizza
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80', // Burger
  'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800&q=80', // Biryani rice
];

export const MENU_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80',
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
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
