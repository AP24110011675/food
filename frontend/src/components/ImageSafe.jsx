import React, { useState } from 'react';

/**
 * ImageSafe Component
 * Handles broken images by providing a fallback and a loading state
 */
const ImageSafe = ({ src, alt, style, className, ...props }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // High-quality fallback food image
  const fallback = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }} className={className}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(90deg, #1c1c24 25%, #2a2a35 50%, #1c1c24 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear'
        }} />
      )}
      <img
        src={error ? fallback : (src || fallback)}
        alt={alt || "Food Image"}
        onError={() => {
          console.warn(`Image load failed: ${src}`);
          setError(true);
          setLoading(false);
        }}
        onLoad={() => setLoading(false)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loading ? 'none' : 'block',
          transition: 'transform 0.5s ease',
        }}
        {...props}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ImageSafe;