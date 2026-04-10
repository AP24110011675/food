import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600',
    title: 'Gourmet Delights Delivered',
    subtitle: 'From Michelin stars to your family table',
    tag: 'PREMIUM SERVICE',
    accent: '#E23744'
  },
  {
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600',
    title: 'Artisan Pizzas Fresh Out',
    subtitle: 'Wood-fired perfection in every slice',
    tag: 'NEW ARRIVAL',
    accent: '#FFB800'
  },
  {
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600',
    title: 'Authentic Global Flavors',
    subtitle: 'Discover cuisines from across the world',
    tag: 'EXPLORE MORE',
    accent: '#3066BE'
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="hero-carousel" style={{
      position: 'relative',
      height: '85vh',
      minHeight: '600px',
      width: '100%',
      overflow: 'hidden',
      background: '#000',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slides[current].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.1)',
          }} />
          
          {/* Gradients Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(15,15,18,1))',
            zIndex: 2,
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
            zIndex: 2,
          }} />

          {/* Content */}
          <div className="container" style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '80px',
          }}>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                color: slides[current].accent,
                fontWeight: 800,
                letterSpacing: '4px',
                fontSize: '0.9rem',
                marginBottom: '16px',
                display: 'block'
              }}
            >
              {slides[current].tag}
            </motion.span>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="heading-xl"
              style={{ 
                color: 'white', 
                maxWidth: '800px',
                marginBottom: '24px',
                textShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              {slides[current].title}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                fontSize: '1.25rem',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                marginBottom: '40px'
              }}
            >
              {slides[current].subtitle}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ display: 'flex', gap: '20px' }}
            >
              <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Order Now
              </button>
              <button style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                View Menu
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav Buttons */}
      <button onClick={prev} style={{
        position: 'absolute',
        top: '50%',
        left: '40px',
        transform: 'translateY(-50%)',
        zIndex: 50,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: '0.3s'
      }} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>

      <button onClick={next} style={{
        position: 'absolute',
        top: '50%',
        right: '40px',
        transform: 'translateY(-50%)',
        zIndex: 50,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: '0.3s'
      }} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'rgba(255,255,255,0.1)',
        zIndex: 20,
      }}>
        <div
          key={current}
          style={{
            height: '100%',
            background: 'var(--primary)',
            animation: 'carouselProgress 4s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes carouselFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes carouselProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @media (max-width: 768px) {
          .hero-carousel button[aria-label="Previous slide"],
          .hero-carousel button[aria-label="Next slide"] {
            width: 40px !important;
            height: 40px !important;
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
}