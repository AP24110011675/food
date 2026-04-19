/**
 * Curated pool of high-quality food & restaurant images.
 * Aligned with category requirements.
 */

export const getImageByCategory = (category = '') => {
  const cat = String(category).toLowerCase();
  switch(cat) {
    case "biryani":
      return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d";
    case "pizza":
      return "https://images.unsplash.com/photo-1594007654729-407eedc4be65";
    case "burger":
      return "https://images.unsplash.com/photo-1550547660-d9450f859349";
    case "north indian":
    case "indian":
      return "https://images.unsplash.com/photo-1585937421612-70a008356fbe";
    case "chinese":
      return "https://images.unsplash.com/photo-1603133872878-684f208fb84b";
    default:
      return "https://images.unsplash.com/photo-1546069901-eacef0df6022";
  }
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-eacef0df6022';

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
 */
export function getRestaurantImage(restaurant = {}) {
  const { image, category } = restaurant;
  if (!isBroken(image) && image.startsWith('http')) return image;
  return getImageByCategory(category);
}

/**
 * Returns a reliable image URL for a menu item.
 */
export function getMenuItemImage(item = {}) {
  const { image, category } = item;
  if (!isBroken(image) && image.startsWith('http')) return image;
  return getImageByCategory(category);
}

const CATEGORY_MAP = {
  'Biryani': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
  'Pizza': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65',
  'Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349',
  'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  'Chinese': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
};

export const RESTAURANT_IMAGE_POOL = Object.values(CATEGORY_MAP);
export const MENU_IMAGE_POOL = Object.values(CATEGORY_MAP);
