import React, { useState } from 'react';

// High-quality food fallback — Indian spread, always looks great
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=800&q=80';

const BROKEN_PATTERNS = ['no-photo', 'placeholder', 'undefined', 'null', 'default'];

function isLikelyBroken(src) {
  if (!src || typeof src !== 'string') return true;
  if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) return true;
  return BROKEN_PATTERNS.some(p => src.toLowerCase().includes(p));
}

const ImageSafe = ({ src, alt = '', className, style, loading = 'lazy', fallback, ...props }) => {
  const effectiveFallback = fallback || FALLBACK_IMAGE;
  const initialSrc = isLikelyBroken(src) ? effectiveFallback : src;

  const [prevSrc, setPrevSrc] = useState(src);
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [errored, setErrored] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(isLikelyBroken(src) ? effectiveFallback : src);
    setErrored(false);
  }

  const handleError = () => {
    if (!errored) {
      setImgSrc(effectiveFallback);
      setErrored(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block',
        ...style,
      }}
      onError={handleError}
      loading={loading}
      {...props}
    />
  );
};

export default ImageSafe;
