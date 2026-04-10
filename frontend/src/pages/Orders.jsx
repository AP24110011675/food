import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Package, Clock, MapPin, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import ImageSafe from '../components/ImageSafe';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'delivered': return '#10b981';
            case 'processing': return '#3b82f6';
            case 'shipped': return '#f59e0b';
            default: return 'var(--primary)';
        }
    };

    if (loading) return (
       <div className="container section-padding" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h1 className="heading-lg">Your Orders</h1>
          <p>Loading your order history...</p>
       </div>
    );

    return (
        <div className="container section-padding" style={{ paddingTop: '120px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '50px' }}>
                <div style={{ background: 'var(--primary)', padding: '15px', borderRadius: '20px' }}>
                    <Package color="white" size={32} />
                </div>
                <div>
                    <h1 className="heading-lg" style={{ marginBottom: '5px' }}>Order History</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track and manage your previous orders</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel"
                            style={{ padding: '32px', borderRadius: '32px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>ORDER ID: #{order._id.slice(-8).toUpperCase()}</div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</h3>
                                </div>
                                <div style={{ 
                                    background: `${getStatusColor(order.status)}15`, 
                                    color: getStatusColor(order.status), 
                                    padding: '8px 16px', 
                                    borderRadius: '12px', 
                                    fontWeight: 'bold', 
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: `1px solid ${getStatusColor(order.status)}40`
                                }}>
                                    <CheckCircle2 size={16} /> {order.status?.toUpperCase() || 'PAID'}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '40px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <ImageSafe src={item.image} style={{ width: '60px', height: '60px', borderRadius: '12px' }} />
                                            <div>
                                                <div style={{ fontWeight: '700' }}>{item.qty}x {item.name}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>${item.price} each</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-muted)' }}>
                                        <MapPin size={16} /> 
                                        <span style={{ fontSize: '13px' }}>{order.shippingAddress.address}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
                                        <span>Paid</span>
                                        <span style={{ color: 'var(--primary)' }}>${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button style={{ width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px', marginTop: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                                        View Details <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <ShoppingBag size={80} color="rgba(255,255,255,0.05)" style={{ marginBottom: '24px' }} />
                        <h2 className="heading-md" style={{ color: 'rgba(255,255,255,0.2)' }}>No orders found</h2>
                        <p style={{ color: 'var(--text-muted)' }}>When you place your first order, it will appear here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;