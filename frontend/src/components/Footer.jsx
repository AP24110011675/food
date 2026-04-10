import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChefHat, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#fff', paddingTop: '100px', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background element */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(226, 55, 68, 0.05) 0%, transparent 70%)', zIndex: 0 }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '60px', marginBottom: '80px' }} className="footer-grid">
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.3)' }}>
                <ChefHat size={26} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>
                Food<span style={{ color: 'var(--primary)' }}>Hub</span>
              </span>
            </Link>
            <p style={{ color: '#94a3b8', lineHeight: '1.8', marginBottom: '40px', fontSize: '1.1rem', maxWidth: '340px' }}>
              Bringing the world's finest cuisines to your doorstep with lightning-fast delivery and uncompromising quality.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[1, 2, 3].map((_, i) => (
                <a key={i} href="#" style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} className="social-link-hover">
                  <ExternalLink size={22} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px', color: '#f8fafc' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s', fontWeight: 500 }}>Home</Link></li>
              <li><Link to="/restaurants" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s', fontWeight: 500 }}>Browse Restaurants</Link></li>
              <li><Link to="/orders" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s', fontWeight: 500 }}>Track Orders</Link></li>
              <li><Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', transition: '0.3s', fontWeight: 500 }}>Member Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px', color: '#f8fafc' }}>Partner</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Register Restaurant</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Become a Rider</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Merchant FAQs</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Rider Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px', color: '#f8fafc' }}>Get in Touch</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', color: '#94a3b8' }}>
                <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} /> 
                <span style={{ lineHeight: '1.5', fontWeight: 500 }}>123 Culinary Boulevard, <br />Bandra West, Mumbai 400050</span>
              </li>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#94a3b8' }}>
                <Phone size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} /> 
                <span style={{ fontWeight: 500 }}>+91 98765 43210</span>
              </li>
              <li style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#94a3b8' }}>
                <Mail size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} /> 
                <span style={{ fontWeight: 500 }}>hello@foodhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made with <Heart size={16} fill="var(--primary)" color="var(--primary)" /> for Food Lovers &copy; {new Date().getFullYear()} FoodHub
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Privacy', 'Terms', 'Cookies'].map((text, i) => (
              <a key={i} href="#" style={{ color: '#64748b', fontSize: '0.95rem', textDecoration: 'none', fontWeight: 500, transition: '0.3s' }} className="footer-link-hover">{text}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .social-link-hover:hover {
          background: var(--primary) !important;
          color: #fff !important;
          transform: translateY(-5px);
        }
        .footer-link-hover:hover {
          color: #fff !important;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
