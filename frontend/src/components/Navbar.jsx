import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
      style={{
        padding: isScrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(226, 55, 68, 0.4)'
          }}>
            <span style={{ color: 'white', fontWeight: '900', fontSize: '20px' }}>F</span>
          </div>
          <span style={{ 
            fontSize: '24px', 
            fontWeight: '800', 
            color: 'white', 
            letterSpacing: '-1px' 
          }}>
            Food<span style={{ color: 'var(--primary)' }}>Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
            <Link to="/cart" style={{ position: 'relative', color: 'white' }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-10px', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  padding: '2px 6px', 
                  borderRadius: '10px',
                  border: '2px solid var(--bg-main)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <User size={18} />
                  <span style={{ fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ transform: isUserDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="glass-panel"
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        right: 0, 
                        marginTop: '15px', 
                        width: '200px', 
                        borderRadius: '20px', 
                        overflow: 'hidden',
                        padding: '10px'
                      }}
                    >
                      <Link to="/dashboard" className="dropdown-item">My Account</Link>
                      <Link to="/orders" className="dropdown-item">Orders</Link>
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }}></div>
                      <button onClick={logout} className="dropdown-item" style={{ color: '#ff4d4d', width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <LogOut size={16} />
                          Logout
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '8px 24px' }}>Login</Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-only" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'white' }}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <style>{`
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          opacity: 0.8;
          transition: 0.3s;
        }
        .nav-link:hover {
          opacity: 1;
          color: var(--primary);
        }
        .dropdown-item {
          display: block;
          padding: 12px 16px;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: 12px;
          transition: 0.3s;
        }
        .dropdown-item:hover {
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
        }
        @media (max-width: 992px) {
          .desktop-only { display: none; }
        }
        @media (min-width: 993px) {
          .mobile-only { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;