import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Clock, Star, MapPin, ArrowRight, Utensils, Zap } from 'lucide-react';
import ImageSafe from '../components/ImageSafe';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ background: 'var(--bg-main)' }}>
      {/* Dynamic Hero Section */}
      <HeroCarousel />

      {/* Featured Categories / Stats */}
      <section className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card" 
              style={{ padding: '40px', textAlign: 'center' }}
            >
              <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Clock color="var(--primary)" size={32} />
              </div>
              <h3 className="heading-md" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Super Fast Delivery</h3>
              <p className="text-muted">Average delivery time of 30 mins to ensure your food stays hot and fresh.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card" 
              style={{ padding: '40px', textAlign: 'center' }}
            >
              <div style={{ background: 'rgba(48, 102, 190, 0.1)', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <ShieldCheck color="#3066BE" size={32} />
              </div>
              <h3 className="heading-md" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Quality Guaranteed</h3>
              <p className="text-muted">We only partner with top-rated restaurants that pass our strict hygiene audits.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card" 
              style={{ padding: '40px', textAlign: 'center' }}
            >
              <div style={{ background: 'rgba(255, 184, 0, 0.1)', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Zap color="#FFB800" size={32} />
              </div>
              <h3 className="heading-md" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Live Tracking</h3>
              <p className="text-muted">Track your order in real-time from the kitchen to your doorstep.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Bento Grid for Categories */}
      <section style={{ paddingBottom: '100px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="heading-lg"
            >
              Crave-worthy Categories
            </motion.h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Discover the perfect dish for every mood</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gridAutoRows: '220px', 
            gap: '24px' 
          }}>
            <Link to="/restaurants?category=Pizza" style={{ gridColumn: 'span 2', gridRow: 'span 2', overflow: 'hidden', borderRadius: '32px', position: 'relative' }}>
              <ImageSafe src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" style={{ width: '100%', height: '100%' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}>
                 <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>Gourmet Pizza</h3>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>EXPLORE <ArrowRight size={18} /></span>
              </div>
            </Link>

            <Link to="/restaurants?category=Burger" style={{ gridColumn: 'span 2', overflow: 'hidden', borderRadius: '32px', position: 'relative' }}>
              <ImageSafe src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800" style={{ width: '100%', height: '100%' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px' }}>
                 <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Craft Burgers</h3>
              </div>
            </Link>

            <Link to="/restaurants?category=Sushi" style={{ overflow: 'hidden', borderRadius: '32px', position: 'relative' }}>
              <ImageSafe src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600" style={{ width: '100%', height: '100%' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>Sushi</h3>
              </div>
            </Link>

            <Link to="/restaurants?category=Healthy" style={{ overflow: 'hidden', borderRadius: '32px', position: 'relative' }}>
              <ImageSafe src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600" style={{ width: '100%', height: '100%' }} />
               <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>Salads</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* App Promo Section */}
      <section className="section-padding glass-panel" style={{ background: 'linear-gradient(rgba(15,15,18,0.95), rgba(15,15,18,0.95)), url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600)', backgroundAttachment: 'fixed' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', alignItems: 'center', gap: '60px' }}>
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="heading-lg" style={{ marginBottom: '24px' }}>Food Deliveries in Your Pocket</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                Download our mobile app for exclusive deals, faster ordering, and real-time delivery tracking even when you're on the move.
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                 <div style={{ 
                   background: '#1c1c24', 
                   padding: '12px 24px', 
                   borderRadius: '16px', 
                   border: '1px solid rgba(255,255,255,0.1)', 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '12px',
                   cursor: 'pointer'
                 }}>
                    <Zap size={24} color="white" />
                    <div>
                       <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COMING SOON TO</div>
                       <div style={{ fontWeight: 'bold' }}>App Store</div>
                    </div>
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
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