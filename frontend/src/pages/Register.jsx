import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import ImageSafe from '../components/ImageSafe';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
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
          src="https://images.unsplash.com/photo-1543352658-927cb1623910?w=1200&q=80" 
          alt="Register Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85))',
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
              Start your <span className="text-gradient">Culinary</span> route here.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: '500px' }}>
              Join FoodHub to explore exquisite flavors and get them delivered with speed.
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
          <div style={{ marginBottom: '32px' }}>
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
              <UserPlus size={28} />
            </motion.div>
            <h1 className="heading-md" style={{ marginBottom: '12px' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Enter your details to create a new account</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                style={{ 
                  background: '#fef2f2', 
                  color: '#991b1b', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  marginBottom: '24px', 
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  name="name"
                  type="text" 
                  className="input-modern" 
                  placeholder="John Doe" 
                  style={{ paddingLeft: '48px', height: '52px' }}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  name="email"
                  type="email" 
                  className="input-modern" 
                  placeholder="name@example.com" 
                  style={{ paddingLeft: '48px', height: '52px' }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '8px' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  name="phone"
                  type="tel" 
                  className="input-modern" 
                  placeholder="+91 98765 43210" 
                  style={{ paddingLeft: '48px', height: '52px' }}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  name="password"
                  type="password" 
                  className="input-modern" 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '48px', height: '52px' }}
                  value={formData.password}
                  onChange={handleChange}
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
              {loading ? <span className="loader" style={{ width: '24px', height: '24px', borderWidth: '3.5px' }}></span> : <>Get Started <ArrowRight size={20} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Login instead</Link>
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

export default Register;
