import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Settings, Heart, Bell, CreditCard, ChevronRight, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: <User size={20} />, title: 'Edit Profile', desc: 'Change your name, email and phone' },
        { icon: <CreditCard size={20} />, title: 'Saved Cards', desc: 'Manage your payment methods' },
        { icon: <Heart size={20} />, title: 'Favorites', desc: 'Your most loved restaurants' },
        { icon: <Bell size={20} />, title: 'Notifications', desc: 'Delivery updates and promos' },
        { icon: <Settings size={20} />, title: 'Settings', desc: 'App preferences and security' },
    ];

    if (!user) return null;

    return (
        <div className="container section-padding" style={{ paddingTop: '120px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel" 
                    style={{ padding: '40px', borderRadius: '32px', textAlign: 'center', marginBottom: '40px' }}
                >
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=e23744&color=fff&size=200`} 
                            alt={user.name} 
                            style={{ width: '100%', height: '100%', borderRadius: '40px', border: '5px solid var(--primary)' }}
                        />
                        <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#10b981', width: '25px', height: '25px', borderRadius: '50%', border: '4px solid #0a0a0c' }}></div>
                    </div>
                    <h1 className="heading-md" style={{ marginBottom: '8px' }}>{user.name}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{user.email} • {user.phone}</p>
                </motion.div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {menuItems.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card"
                            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer' }}
                        >
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px', color: 'var(--primary)' }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{item.desc}</p>
                            </div>
                            <ChevronRight color="rgba(255,255,255,0.2)" />
                        </motion.div>
                    ))}

                    <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        onClick={logout}
                        style={{ 
                            background: 'rgba(226, 55, 68, 0.1)', 
                            border: '1px solid var(--primary)', 
                            color: 'var(--primary)', 
                            padding: '16px', 
                            borderRadius: '16px', 
                            marginTop: '20px', 
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px',
                            cursor: 'pointer' 
                        }}
                    >
                        <LogOut size={20} /> Sign Out of FoodHub
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;