import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#09090b', padding: '80px 0 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {/* Logo Section */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary)', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>F</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>FoodHub</span>
            </Link>
            <p style={{ color: '#8F8F9F', fontSize: '14px', lineHeight: '1.8' }}>
              Experience the best cuisine from top-rated restaurants, delivered fresh to your doorstep within 30 minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/restaurants" className="footer-link">All Restaurants</Link></li>
              <li><Link to="/offers" className="footer-link">Special Offers</Link></li>
              <li><Link to="/cuisines" className="footer-link">Browse Cuisines</Link></li>
              <li><Link to="/blog" className="footer-link">Food Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>Stay Connected</h4>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="Your email address" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '12px 15px', 
                  borderRadius: '12px', 
                  color: 'white' 
                }} 
              />
              <button style={{ position: 'absolute', right: '5px', top: '5px', bottom: '5px', background: 'var(--primary)', border: 'none', color: 'white', padding: '0 15px', borderRadius: '8px', cursor: 'pointer' }}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <p style={{ color: '#52525b', fontSize: '13px' }}>
            © {new Date().getFullYear()} FoodHub Inc. Built with ❤️ for food lovers everywhere.
          </p>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: #8F8F9F;
          text-decoration: none;
          font-size: 14px;
          display: block;
          margin-bottom: 12px;
          transition: 0.3s;
        }
        .footer-link:hover {
          color: var(--primary);
          padding-left: 5px;
        }
        .social-icon {
          color: white;
          background: rgba(255,255,255,0.05);
          width: 40px;
          height: 40px;
          display: flex;
          alignItems: center;
          justifyContent: center;
          border-radius: 50%;
          transition: 0.3s;
        }
        .social-icon:hover {
          background: var(--primary);
          transform: translateY(-5px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;