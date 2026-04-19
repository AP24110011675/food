import React from 'react';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageSafe from './ImageSafe';
import { getRestaurantImage, RESTAURANT_IMAGE_POOL } from '../utils/restaurantImages';

const RestaurantCard = ({ data: restaurant, onClick }) => {
  return (
    <motion.div 
      key={restaurant._id} 
      className="card hover-pop" 
      style={{ cursor: 'pointer', overflow: 'hidden', padding: 0, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--shadow-md)', background: '#fff' }}
      onClick={() => onClick(restaurant)}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
        <ImageSafe
          src={getRestaurantImage(restaurant)}
          fallback={RESTAURANT_IMAGE_POOL[0]}
          alt={restaurant.name}
          className="card-img-fixed"
        />
        <div className="card-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#15b315', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 900, zIndex: 2, boxShadow: 'var(--shadow-sm)' }}>
          {restaurant.rating || '4.2'} <Star size={14} fill="white" />
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{restaurant.name}</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {restaurant.cuisineType?.join(' • ') || restaurant.category}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, borderTop: '1px solid #f8fafc', paddingTop: '15px' }}>
          <span>₹{restaurant.averageCost || '300'} for two</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {restaurant.deliveryTime || '25-30'} MINS</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
