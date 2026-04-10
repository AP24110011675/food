import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MapPin, Search, ChevronRight, Grid, List as ListIcon, ShoppingBag, Plus, Minus, Info } from 'lucide-react';
import ImageSafe from '../components/ImageSafe';
import { useCart } from '../context/CartContext';
import { restaurantImages, getRestaurantImage } from '../utils/restaurantImages';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const { addToCart, removeFromCart, cartItems } = useCart();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants');
      setRestaurants(data.data || []);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (restaurantId) => {
    setMenuLoading(true);
    try {
      const { data } = await api.get(`/menu/${restaurantId}`);
      setMenuItems(data.data || []);
    } catch (err) {
      console.error('Error fetching menu:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchMenu(restaurant._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getItemQty = (id) => {
    const item = cartItems.find(i => i.product === id);
    return item ? item.qty : 0;
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '120px' }}>
      {!selectedRestaurant ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="heading-lg" 
              >
                Top Rated Near You
              </motion.h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Handpicked restaurants delivering the best quality</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Search dishes or restaurants..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    padding: '12px 16px 12px 50px', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    background: 'var(--glass-bg)', 
                    color: 'white',
                    width: '300px'
                  }} 
                />
              </div>
            </div>
          </div>

          {loading ? (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="glass-card" style={{ height: '350px', animate: 'shimmer 1.5s infinite' }}></div>
                ))}
             </div>
          ) : (
            <motion.div 
              layout
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}
            >
              <AnimatePresence>
                {filteredRestaurants.map((res) => (
                  <motion.div 
                    layout
                    key={res._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card"
                    style={{ cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => handleRestaurantClick(res)}
                  >
                    <div style={{ height: '180px', position: 'relative' }}>
                      <ImageSafe 
                        src={getRestaurantImage(res.name)} 
                        alt={res.name} 
                        style={{ height: '100%', width: '100%', transition: '0.6s transform' }} 
                      />
                      <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'white', padding: '5px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Star size={14} color="#FFB800" fill="#FFB800" />
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{res.rating || '4.0'}</span>
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{res.name}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{res.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)', fontSize: '13px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> 30 min</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> 2.5 km</span>
                         </div>
                         <div style={{ background: 'rgba(226, 55, 68, 0.1)', color: 'var(--primary)', padding: '5px 12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px' }}>
                            ORDER NOW
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          {/* Detailed View */}
          <button 
            onClick={() => setSelectedRestaurant(null)}
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', fontWeight: 'bold' 
            }}
          >
             <ChevronRight style={{ transform: 'rotate(180deg)' }} /> Back to all restaurants
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '40px', className: 'grid-responsive' }}>
             <div>
               <div style={{ borderRadius: '32px', overflow: 'hidden', height: '300px', marginBottom: '24px' }}>
                 <ImageSafe src={getRestaurantImage(selectedRestaurant.name)} style={{ height: '100%', width: '100%' }} />
               </div>
               <h2 className="heading-md" style={{ marginBottom: '16px' }}>{selectedRestaurant.name}</h2>
               <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#FFB800', fontWeight: 'bold' }}><Star size={18} fill="#FFB800" /> {selectedRestaurant.rating || '4.0'}</span>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={18} /> 25-35 mins</span>
               </div>
               <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>{selectedRestaurant.description}</p>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Menu</h3>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '12px', display: 'flex', gap: '5px' }}>
                     <button onClick={() => setViewMode('grid')} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer' }}><Grid size={18} /></button>
                     <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer' }}><ListIcon size={18} /></button>
                  </div>
                </div>

                {menuLoading ? (
                   [1,2,3,4].map(i => <div key={i} className="glass-card" style={{ height: '120px' }}></div>)
                ) : menuItems.length > 0 ? (
                  menuItems.map(item => (
                    <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card"
                      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.name}</h4>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', display: 'block', marginTop: '5px' }}>${item.price}</span>
                        </div>
                        <ImageSafe src={item.image} style={{ width: '80px', height: '80px', borderRadius: '16px' }} />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Popularity: 95%</span>
                         
                         <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '12px' }}>
                            {getItemQty(item._id) > 0 ? (
                              <>
                                <button onClick={() => removeFromCart(item._id)} style={{ border: 'none', background: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                                <span style={{ fontWeight: 'bold' }}>{getItemQty(item._id)}</span>
                                <button onClick={() => addToCart({ ...item, product: item._id })} style={{ border: 'none', background: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                              </>
                            ) : (
                              <button 
                                onClick={() => addToCart({ ...item, product: item._id })}
                                style={{ border: 'none', background: 'none', color: 'white', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Plus size={14} /> ADD
                              </button>
                            )}
                         </div>
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