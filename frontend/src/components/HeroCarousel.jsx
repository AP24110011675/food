import React, { useState, useEffect, useCallback, useRef } from 'react';
import ImageSafe from './ImageSafe';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
    label: 'Authentic Street Food',
    sub: 'From the heart of Indian kitchens',
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
    label: 'Fine Dining Delivered',
    sub: 'Restaurant-quality meals at your door',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
    label: 'Cozy Dhaba Vibes',
    sub: 'The rustic taste you always crave',
  },
  {
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1920&q=80',
    label: 'Fresh & Flavourful',
    sub: 'Handcrafted meals with local ingredients',
  },
  {
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1920&q=80',
    label: 'Burgers & Beyond',
    sub: 'Juicy goodness delivered fast',
  },
];

export default function HeroCarousel({ children }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent((index + slides.length) % slides.length);
    setTimeout(() => setTransitioning(false), 700);
  }, [transitioning]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  // Pause on hover
  const pause = () => clearInterval(timerRef.current);
  const resume = () => { timerRef.current = setInterval(next, 4000); };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <ImageSafe
            src={slide.image}
            alt={slide.label}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.85) 100%)',
          }} />
        </div>
      ))}

      {/* Text Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        padding: '0 24px',
        textAlign: 'center',
      }}>
        <div
          key={current}
          style={{ animation: 'carouselFadeUp 0.7s ease forwards' }}
        >
          <span style={{
            display: 'inline-block',
            background: 'var(--primary)',
            color: 'white',
            padding: '6px 20px',
            borderRadius: '100px',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(226,55,68,0.5)',
          }}>
            {slides[current].label}
          </span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
            textShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            Order Delicious Food<br />
            <span style={{ color: 'var(--primary)' }}>Instantly</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            color: 'rgba(255,255,255,0.82)',
            marginBottom: '40px',
            fontWeight: 300,
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            {slides[current].sub}
          </p>
        </div>

        {/* Children (search bar from Home.jsx) */}
        {children}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '1.4rem',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,55,68,0.85)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '1.4rem',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,55,68,0.85)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '32px' : '10px',
              height: '10px',
              borderRadius: '100px',
              background: i === current ? 'var(--primary)' : 'rgba(255,255,255,0.45)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              outline: 'none',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
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
