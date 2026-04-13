import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import ImageSafe from '../components/ImageSafe';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#fff', 
      marginTop: '-120px',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Left Decoration Panel */}
      <div style={{ 
        flex: 1.2, 
        position: 'relative', 
        overflow: 'hidden',
        display: 'none'
      }} className="hide-on-mobile">
        <ImageSafe 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80" 
          alt="Login Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1 }}>
              Taste the <span className="text-gradient">Magic</span> in every bite.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: '500px' }}>
              Join thousands of food lovers and get the best meals delivered from top-rated restaurants.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '40px 60px',
        background: 'white'
      }}>
        <motion.div 
          style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ marginBottom: '40px' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ 
                background: 'rgba(var(--primary-rgb), 0.1)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px', 
                color: 'var(--primary)' 
              }}
            >
              <LogIn size={28} />
            </motion.div>
            <h1 className="heading-md" style={{ marginBottom: '12px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Enter your credentials to access your account</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                style={{ 
                  background: '#fef2f2', 
                  color: '#991b1b', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  marginBottom: '28px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  fontSize: '0.95rem', 
                  fontWeight: 600,
                  border: '1px solid #fee2e2'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '10px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  className="input-modern" 
                  placeholder="name@example.com" 
                  style={{ paddingLeft: '48px', height: '56px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label className="form-label">Password</label>
                <Link to="#" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  className="input-modern" 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '48px', height: '56px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                height: '56px', 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                marginTop: '10px'
              }}
              disabled={loading}
            >
              {loading ? <span className="loader" style={{ width: '24px', height: '24px', borderWidth: '3.5px' }}></span> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Join FoodHub</Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
