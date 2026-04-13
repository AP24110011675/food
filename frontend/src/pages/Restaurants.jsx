import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../hooks/useCart';
import { Star, MapPin, ChevronLeft, ChevronRight, Zap, Search, Filter, Clock, Flame, Info, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSafe from '../components/ImageSafe';
import { getRestaurantImage, getMenuItemImage, RESTAURANT_IMAGE_POOL } from '../utils/restaurantImages';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'biryani', name: 'Biryani', icon: '🍚' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burger', name: 'Burger', icon: '🍔' },
  { id: 'north indian', name: 'North Indian', icon: '🍛' },
  { id: 'chinese', name: 'Chinese', icon: '🥡' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
];

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useCart();
  const sliderRef = useRef(null);

  const featuredDishes = useMemo(() => [
    { id: 1, name: 'Premium Mutton Biryani', price: 450, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
    { id: 2, name: 'Double Cheese Margherita', price: 320, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
    { id: 3, name: 'Monster Wagyu Burger', price: 550, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
    { id: 4, name: 'Chicken Tikka Roll', price: 210, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', rating: 4.6 },
    { id: 5, name: 'Dal Makhani Special', price: 280, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
    { id: 6, name: 'Paneer Tikka Masala', price: 320, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', rating: 4.7 },
    { id: 7, name: 'Masala Dosa', price: 150, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80', rating: 4.5 },
    { id: 8, name: 'Samosa Chaat', price: 120, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', rating: 4.4 },
  ], []);

  const scrollSlider = useCallback((direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - (clientWidth * 0.8) : scrollLeft + (clientWidth * 0.8);
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants');
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenu = useCallback(async (restaurantId) => {
    try {
      setLoading(true);
      const res = await api.get(`/menu/${restaurantId}`);
      setMenuItems(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectRestaurant = useCallback((restaurant) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedRestaurant(restaurant);
    fetchMenu(restaurant._id);
  }, [fetchMenu]);

  useEffect(() => {
    fetchRestaurants();
    const search = searchParams.get('search');
    const cat = searchParams.get('category');
    if (search) setSearchTerm(search);
    if (cat) setCategoryFilter(cat);
  }, [searchParams, fetchRestaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const nameMatch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const cuisineMatch = r.cuisineType?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || r.cuisineType?.some(c => c.toLowerCase().includes(categoryFilter.toLowerCase()));
      return (nameMatch || cuisineMatch) && matchesCategory;
    });
  }, [restaurants, searchTerm, categoryFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading && restaurants.length === 0) {
    return (
      <div className="container" style={{ padding: '120px 20px' }}>
        <div className="skeleton" style={{ height: '60px', width: '400px', marginBottom: '48px', borderRadius: '16px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card" style={{ height: '400px', padding: 0, borderRadius: '24px' }}>
              <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: '24px 24px 0 0' }}></div>
              <div style={{ padding: '24px' }}>
                <div className="skeleton" style={{ height: '28px', width: '75%', marginBottom: '16px' }}></div>
                <div className="skeleton" style={{ height: '18px', width: '50%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="restaurants-page" style={{ paddingTop: '100px', minHeight: '100vh', background: '#fcfcfc' }}>
      {!selectedRestaurant ? (
        <motion.div
           initial="hidden"
           animate="show"
           variants={containerVariants}
        >
          {/* SEARCH & FILTERS HEADER */}
          <section className="container" style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '40px' }}>
              <motion.div variants={itemVariants}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Satisfy your <span className="text-gradient">Cravings</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>Discover the best food & drinks in your area.</p>
              </motion.div>
              
              <motion.div variants={itemVariants} style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                <Search size={22} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search restaurants or cuisines..." 
                  style={{ 
                    paddingLeft: '60px', 
                    borderRadius: '24px', 
                    height: '68px',
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: '#fff'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
            </div>

            {/* Category Chips */}
            <motion.div 
              variants={itemVariants}
              style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', className: 'no-scrollbar' }}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '16px',
                    border: '1.5px solid',
                    borderColor: categoryFilter === cat.id ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    background: categoryFilter === cat.id ? 'var(--primary)' : '#fff',
                    color: categoryFilter === cat.id ? '#fff' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: categoryFilter === cat.id ? '0 8px 20px rgba(var(--primary-rgb), 0.2)' : '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                  className="hover-pop"
                >
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </motion.div>
          </section>

          {searchTerm === '' && (
            <motion.section variants={itemVariants} className="container" style={{ marginBottom: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '4px' }}>
                    Top <span style={{ color: 'var(--primary)' }}>Sellers</span> 🏆
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>The most frequent orders in your neighborhood</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => scrollSlider('left')} className="btn glass-card" style={{ width: '48px', height: '48px', padding: 0, borderRadius: '50%', color: 'var(--text-primary)', justifyContent: 'center' }}>
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => scrollSlider('right')} className="btn glass-card" style={{ width: '48px', height: '48px', padding: 0, borderRadius: '50%', color: 'var(--text-primary)', justifyContent: 'center' }}>
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <div 
                ref={sliderRef}
                className="slider-container" 
                style={{ 
                  height: '380px', 
                  gap: '32px',
                  padding: '10px 10px 40px'
                }}
              >
                {featuredDishes.map((dish) => (
                  <motion.div
                    key={dish.id}
                    whileHover={{ y: -10 }}
                    style={{ minWidth: '300px', height: '100%', cursor: 'pointer' }}
                    onClick={() => setSearchTerm(dish.name)}
                  >
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, borderRadius: '28px', boxShadow: 'var(--shadow-lg)' }}>
                      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <ImageSafe src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(var(--primary-rgb), 0.95)', color: 'white', padding: '6px 14px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(10px)' }}>
                          <Flame size={14} fill="white" /> TRENDING
                        </div>
                      </div>
                      <div style={{ padding: '24px', background: 'white' }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>{dish.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>₹{dish.price}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15b315', fontWeight: 800, fontSize: '0.95rem', background: '#f0fdf4', padding: '4px 10px', borderRadius: '10px' }}>
                             {dish.rating} <Star size={14} fill="#15b315" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          <section className="container" style={{ marginBottom: '100px' }}>
            <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Popular <span style={{ color: 'var(--primary)' }}>Halt</span> 📍</h2>
               <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{filteredRestaurants.length} restaurants ready to serve you</p>
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <motion.div 
                    key={restaurant._id} 
                    variants={itemVariants}
                    className="card hover-pop" 
                    style={{ cursor: 'pointer', overflow: 'hidden', padding: 0, borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--shadow-md)', background: '#fff' }}
                    onClick={() => handleSelectRestaurant(restaurant)}
                  >
                    <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                      <ImageSafe
                        src={getRestaurantImage(restaurant)}
                        fallback={RESTAURANT_IMAGE_POOL[0]}
                        alt={restaurant.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      />
                      <div className="card-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                        <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <Clock size={14} /> {restaurant.deliveryTime || '25-30'} MINS
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{restaurant.name}</h3>
                        <div style={{ background: '#15b315', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '10px', fontSize: '1rem', fontWeight: 900 }}>
                          {restaurant.rating || '4.2'} <Star size={14} fill="white" />
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '24px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {restaurant.cuisineType?.join(' • ')}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 700, borderTop: '1px solid #f8fafc', paddingTop: '20px' }}>
                        <span>₹{restaurant.averageCost || '300'} for two</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {restaurant.address?.city || restaurant.address || 'Bandra'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🔍</div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>No results for &quot;{searchTerm}&quot;</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>We couldn&apos;t find what you&apos;re looking for. Try another keyword!</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }} 
                    className="btn btn-primary" 
                    style={{ marginTop: '32px', padding: '16px 40px', borderRadius: '18px', fontWeight: 800 }}
                  >
                    Refresh Search
                  </button>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      ) : (
        /* MENU VIEW */
        <motion.div 
          className="menu-section" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 100px' }}
        >
          <button 
            onClick={() => setSelectedRestaurant(null)} 
            style={{ 
              marginBottom: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              border: 'none', 
              background: 'white', 
              cursor: 'pointer', 
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              padding: '12px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            className="hover-pop"
          >
            <ArrowLeft size={20} /> Back to explore
          </button>
          
          <div style={{ position: 'relative', borderRadius: '48px', overflow: 'hidden', marginBottom: '60px', boxShadow: 'var(--shadow-xl)' }}>
             <div style={{ height: '400px', width: '100%' }}>
                <ImageSafe
                  src={getRestaurantImage(selectedRestaurant)}
                  fallback={RESTAURANT_IMAGE_POOL[0]}
                  alt={selectedRestaurant.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)' }} />
             </div>
             
             <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                       <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 900 }}>RESTAURANT</span>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: 700 }}>
                          <Star size={18} fill="#ffcc00" color="#ffcc00" /> {selectedRestaurant.rating} (500+ ratings)
                       </div>
                    </div>
                    <h2 style={{ fontSize: '4.5rem', fontWeight: 900, margin: 0, letterSpacing: '-2px' }}>{selectedRestaurant.name}</h2>
                    <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500, maxWidth: '700px', marginTop: '12px' }}>{selectedRestaurant.description || 'Authentic flavors delivered with love right to your doorstep.'}</p>
                  </div>
                </div>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '32px' }} className="grid-responsive">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="card" style={{ height: '180px', borderRadius: '32px' }}></div>
              ))
            ) : menuItems.length > 0 ? (
              menuItems.map((item) => (
                <motion.div 
                  key={item._id} 
                  className="card hover-pop" 
                  style={{ display: 'flex', gap: '24px', padding: '24px', alignItems: 'center', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--shadow-md)', background: '#fff' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ width: '14px', height: '14px', border: '1.5px solid #15b315', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15b315' }}></div>
                      </div>
                      <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{item.name}</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', fontWeight: 500, lineHeight: '1.5', height: '45px', overflow: 'hidden' }}>{item.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--primary)' }}>₹{item.price}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(item)} 
                        className="btn btn-primary" 
                        style={{ padding: '12px 32px', fontWeight: 800, borderRadius: '16px', fontSize: '1.1rem' }}
                      >
                        ADD +
                      </motion.button>
                    </div>
                  </div>
                  <div style={{ width: '150px', height: '150px', borderRadius: '24px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                    <ImageSafe src={getMenuItemImage(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', background: '#f8fafc', borderRadius: '32px' }}>
                  <Info size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No items in menu yet</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Check back later for exciting new dishes!</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media (max-width: 768px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
          h1 { font-size: 2.5rem !important; }
          h2 { font-size: 3rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Restaurants;
