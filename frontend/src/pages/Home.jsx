import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Star, 
  Search, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Zap,
  Award,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSafe from '../components/ImageSafe';
import HeroCarousel from '../components/HeroCarousel';
import { getRestaurantImage } from '../utils/restaurantImages';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [locationName, setLocationName] = useState('📍 Hyderabad, TG');

  const detectLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setLocationName('📍 Detecting...');
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const city = data.city || data.locality || data.principalSubdivision || 'Hyderabad';
          setLocationName(`📍 ${city}`);
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          setLocationName('📍 Hyderabad');
        }
      }, (err) => {
        console.error('Geolocation error:', err);
        setLocationName('📍 Hyderabad');
        alert("Please allow location access to see your city.");
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const dishesRef = useRef(null);

  useEffect(() => {
    const fetchTopRestaurants = async () => {
      try {
        setLoading(true);
        const res = await api.get("/restaurants");
        const data = res.data.data || res.data || [];
        setRestaurants(data.slice(0, 8)); // Top 8 for the home page
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRestaurants();
    detectLocation();
  }, [detectLocation]);

  const popularDishes = useMemo(() => [
    { name: 'Trending', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80' },
    { name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=500&q=80' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80' },
    { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80' },
    { name: 'North Indian', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80' },
    { name: 'Chinese', image: 'https://images.unsplash.com/photo-1544333346-64e371bcd405?auto=format&fit=crop&w=500&q=80' },
  ], []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, navigate]);

  const scroll = useCallback((direction, ref = scrollRef) => {
    const { current } = ref;
    if (current) {
      const scrollAmount = 400;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="home-page">
      {/* 1. HERO CAROUSEL */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroCarousel>
          {/* Search Bar inside carousel overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ width: '100%', maxWidth: '820px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 10 }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                padding: '8px',
                borderRadius: '16px',
                background: 'white',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                flexWrap: 'wrap',
                gap: '0',
              }}
            >
              <div 
                style={{ display: 'flex', alignItems: 'center', flex: '1 1 160px', padding: '12px 20px', color: '#666', borderRight: '1.5px solid #f1f5f9', minWidth: 0, cursor: 'pointer' }}
                onClick={detectLocation}
              >
                <MapPin size={20} color="#E23744" style={{ marginRight: '10px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {locationName}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flex: '2 1 200px', padding: '12px 20px', color: '#666', minWidth: 0 }}>
                <Search size={20} style={{ marginRight: '10px', flexShrink: 0, color: '#999' }} />
                <input
                  type="text"
                  placeholder="Search for restaurant or dish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 500, background: 'transparent', color: '#333' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#E23744',
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#c0202d'}
                onMouseLeave={e => e.currentTarget.style.background = '#E23744'}
              >
                Find Food
              </button>
            </form>
          </motion.div>
        </HeroCarousel>
      </div>

      {/* 2. POPULAR DISHES (CATEGORIES) */}
      <section className="section-padding" style={{ background: '#fff' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '60px' }}
          >
            <h2 className="heading-md">Inspiration for your <span className="text-gradient">first order</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 500 }}>Handcrafted categories for your unique cravings</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            ref={dishesRef}
            className="grid-layout"
            style={{ 
              padding: '10px 0 20px',
            }}
          >
            {popularDishes.map((dish, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                style={{ 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                onClick={() => navigate(`/restaurants?category=${dish.name}`)}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    width: '160px', 
                    height: '160px', 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    marginBottom: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    border: '4px solid white'
                  }}>
                    <ImageSafe src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a' }}>{dish.name}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. TOP RESTAURANTS */}
      <section className="section-padding" style={{ background: '#fcfcfc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-md">Top restaurants near <span className="text-gradient">you</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Discover the highest rated restaurants in your neighborhood</p>
            </motion.div>
          </div>

          <motion.div 
            className="restaurant-grid" 
            style={{ 
              padding: '10px 0 40px',
            }}
          >
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: '420px', borderRadius: 'var(--radius-lg)' }}></div>
              ))
            ) : restaurants.length > 0 ? (
              <AnimatePresence>
                {restaurants.map((res, idx) => (
                  <motion.div 
                    key={res._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    style={{ 
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/restaurants?id=${res._id}`)}
                  >
                    <div className="card" style={{ height: '100%', overflow: 'hidden', padding: 0, borderRadius: '12px' }}>
                      <div style={{ height: '220px', position: 'relative' }}>
                        <ImageSafe src={getRestaurantImage(res)} alt={res.name} className="card-img-fixed" />
                        <div className="card-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', opacity: 1 }} />
                        <div style={{ 
                          position: 'absolute', 
                          top: '15px', 
                          right: '15px',
                          background: '#15b315',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: 'var(--shadow-sm)',
                          zIndex: 2
                        }}>
                          {res.rating} <Star size={12} fill="currentColor" />
                        </div>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px', color: 'var(--text-primary)' }}>{res.name}</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {res.cuisineType?.join(', ') || 'Continental, Indian, Desserts'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>₹{res.averageCost || '400'} for two</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>
                            <Zap size={14} fill="#fbbf24" color="#fbbf24" /> {res.deliveryTime || '30'} MINS
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No top restaurants found in your area.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="section-padding container" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {[
            { 
              icon: <Zap size={36} />, 
              title: "Instant Delivery", 
              desc: "From the kitchen to your table in under 30 minutes. We value your hunger.",
              color: 'var(--primary)',
              bg: 'rgba(var(--primary-rgb), 0.1)'
            },
            { 
              icon: <Award size={36} />, 
              title: "Premium Quality", 
              desc: "Every restaurant on our platform is hand-picked for taste and hygiene.",
              color: '#3b82f6',
              bg: 'rgba(59, 130, 246, 0.1)'
            },
            { 
              icon: <Smartphone size={36} />, 
              title: "Smart Tracking", 
              desc: "Track your food in real-time with our state-of-the-art tracking system.",
              color: '#10b981',
              bg: 'rgba(16, 185, 129, 0.1)'
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ scale: 1.02 }}
              style={{ padding: '32px', borderRadius: 'var(--radius-lg)', background: '#fff', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--shadow-md)' }}
            >
              <div style={{ 
                background: feature.bg, 
                color: feature.color, 
                width: '72px', 
                height: '72px', 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 800 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. APP PROMO */}
      <section style={{ padding: '100px 0', background: 'var(--secondary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', alignItems: 'center', gap: '80px' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-md" style={{ color: 'white', marginBottom: '24px' }}>Get the <span className="text-gradient">FoodHub</span> app</h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '40px' }}>We will send you a link, open it on your phone to download the app</p>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>
                  <input type="radio" name="comm" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} defaultChecked /> Email
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>
                  <input type="radio" name="comm" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} /> Phone
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="text" className="input-modern" placeholder="Email" style={{ flex: 1, color: '#1a1a1a' }} />
                <button className="btn btn-primary" style={{ padding: '0 32px' }}>Share App Link</button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center' }}
            >
              <ImageSafe 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600" 
                alt="App Interface" 
                style={{ width: '100%', maxWidth: '400px', borderRadius: '40px', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }} 
              />
            </motion.div>
          </div>
        </div>
        {/* Background Decorative Circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-150px', left: '-50px', width: '300px', height: '300px', background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '50%' }}></div>
      </section>
    </div>
  );
};

export default Home;
