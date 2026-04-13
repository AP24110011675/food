import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ShoppingCart, User, LogOut, History, ChefHat, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle = {
    backgroundColor: isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.85)',
    boxShadow: isTransparent ? 'none' : 'var(--shadow-md)',
    backdropFilter: isTransparent ? 'none' : 'blur(15px)',
    borderBottom: isTransparent ? 'none' : '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: isScrolled ? '12px 0' : '20px 0',
  };

  const linkStyle = (active) => ({
    color: active ? 'var(--primary)' : (isTransparent ? '#fff' : 'var(--text-primary)'),
    textDecoration: 'none',
    fontWeight: active ? 700 : 500,
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: 'var(--radius)',
    transition: 'var(--transition)',
    background: active && !isTransparent ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
  });

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            style={{ background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.3)' }}
          >
            <ChefHat size={24} strokeWidth={2.5} />
          </motion.div>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: isTransparent ? '#fff' : 'var(--text-primary)', letterSpacing: '-1px' }}>
            Food<span style={{ color: isTransparent ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }}>Hub</span>
          </span>
        </Link>

        {/* Global Search - Hidden on Hero but visible elsewhere */}
        <AnimatePresence>
          {!isTransparent && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if (query.trim()) navigate(`/restaurants?search=${query}`);
              }}
              style={{ flex: 1, maxWidth: '450px', margin: '0 40px', position: 'relative' }} 
            >
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="search"
                type="text" 
                placeholder="Search for restaurants, cuisines..." 
                className="input-modern"
                style={{ paddingLeft: '44px', background: '#f8fafc', border: 'none', width: '100%', boxShadow: 'none' }}
              />
            </motion.form>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link to="/restaurants" style={linkStyle(location.pathname === '/restaurants')}>Explore</Link>
          
          <Link to="/cart" style={linkStyle(location.pathname === '/cart')} className="cart-link">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={20} />
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{ 
                      position: 'absolute', 
                      top: '-10px', 
                      right: '-12px', 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      border: '2px solid #fff',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {user ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1.5px solid rgba(0,0,0,0.05)' }}>
              <Link to="/orders" style={linkStyle(location.pathname === '/orders')} title="My Orders">
                <History size={20} />
              </Link>
              {(user.role === 'admin' || user.role === 'restaurant_owner') && (
                <Link to="/admin/orders" style={linkStyle(location.pathname === '/admin/orders')} title="Manage Orders">
                  <ChefHat size={20} />
                </Link>
              )}
              <Link to="/dashboard" style={linkStyle(location.pathname === '/dashboard')}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isTransparent ? 'rgba(255,255,255,0.2)' : '#f8fafc', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <User size={18} />
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
                </motion.div>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.1, color: 'var(--primary)' }}
                onClick={logout} 
                className="btn" 
                style={{ padding: '8px', borderRadius: '50%', color: 'var(--text-muted)', minWidth: 'auto', background: 'transparent' }}
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '16px' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: isTransparent ? '#fff' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: 'var(--radius-full)' }}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
