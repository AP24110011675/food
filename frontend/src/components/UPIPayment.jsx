import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle, Smartphone, ExternalLink, Info, X } from 'lucide-react';

const UPI_ID = '9229532848@axl';
const PAYEE_NAME = 'FoodHub';

function buildUPILink(amount) {
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('FoodHub Order Payment')}`;
}

/** Very simple QR renderer using a free Google Charts API */
function QRCode({ value, size = 200 }) {
  const url = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(value)}&choe=UTF-8`;
  return (
    <img
      src={url}
      alt="UPI QR Code"
      width={size}
      height={size}
      style={{ borderRadius: '16px', display: 'block', border: '4px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    />
  );
}

const UPI_APPS = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    color: '#5f259f',
    gradient: 'linear-gradient(135deg, #5f259f 0%, #8b3dc8 100%)',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
        <circle cx="24" cy="24" r="24" fill="#5f259f"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Pe</text>
      </svg>
    ),
    deepLink: (amount) => `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR`,
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    color: '#1a73e8',
    gradient: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
        <circle cx="24" cy="24" r="24" fill="white"/>
        <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" fill="#1a73e8" fontSize="14" fontWeight="bold">G</text>
        <text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle" fill="#34a853" fontSize="8" fontWeight="bold">Pay</text>
      </svg>
    ),
    deepLink: (amount) => buildUPILink(amount),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    color: '#002970',
    gradient: 'linear-gradient(135deg, #002970 0%, #00BAF2 100%)',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
        <circle cx="24" cy="24" r="24" fill="#002970"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Paytm</text>
      </svg>
    ),
    deepLink: (amount) => buildUPILink(amount),
  },
  {
    id: 'upi',
    name: 'Any UPI App',
    color: '#E23744',
    gradient: 'linear-gradient(135deg, #E23744 0%, #ff6b6b 100%)',
    icon: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
        <circle cx="24" cy="24" r="24" fill="#E23744"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">UPI</text>
      </svg>
    ),
    deepLink: (amount) => buildUPILink(amount),
  },
];

export default function UPIPayment({ amount, orderId, onPaymentClaimed, onClose }) {
  const [copied, setCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [txnId, setTxnId] = useState('');
  const [step, setStep] = useState('choose'); // 'choose' | 'qr' | 'confirm'
  const upiLink = buildUPILink(amount);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleAppPay = (app) => {
    setSelectedApp(app);
    // Attempt deep link — browser will redirect to app if installed
    window.location.href = app.deepLink(amount);
    // After 1.5s assume redirect happened, show confirm step
    setTimeout(() => setStep('confirm'), 1500);
  };

  const handleQRPay = () => {
    setStep('qr');
  };

  const handlePaid = () => {
    onPaymentClaimed({ upiTransactionId: txnId });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          background: 'white',
          borderRadius: '32px',
          width: '100%',
          maxWidth: '520px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.35)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Paying via UPI
            </div>
            <div style={{ color: 'white', fontSize: '2rem', fontWeight: 900 }}>
              ₹{amount}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '8px 16px',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              🔒 Secure
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          <AnimatePresence mode="wait">

            {/* STEP 1: Choose app */}
            {step === 'choose' && (
              <motion.div key="choose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>
                  Pay with UPI App
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', fontWeight: 500 }}>
                  Choose your preferred payment app to pay instantly
                </p>

                {/* UPI App Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
                  {UPI_APPS.map((app) => (
                    <motion.button
                      key={app.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAppPay(app)}
                      style={{
                        background: app.gradient,
                        border: 'none',
                        borderRadius: '18px',
                        padding: '18px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: `0 8px 24px ${app.color}40`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px', display: 'flex' }}>
                        {app.icon}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div>{app.name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500 }}>Tap to open app</div>
                      </div>
                      <ExternalLink size={16} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                    </motion.button>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>

                {/* UPI ID & QR */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  marginBottom: '20px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                    UPI ID
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a1a', flex: 1 }}>{UPI_ID}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={copyUpiId}
                      style={{
                        background: copied ? '#10b981' : '#E23744',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background 0.3s',
                        flexShrink: 0,
                      }}
                    >
                      {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQRPay}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1a1a2e, #2d2d5e)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <Smartphone size={20} /> Scan QR Code Instead
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: QR Code */}
            {step === 'qr' && (
              <motion.div key="qr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>
                  Scan to Pay ₹{amount}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>
                  Open any UPI app and scan this QR code
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <div style={{ padding: '20px', background: 'white', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', border: '2px solid #f1f5f9' }}>
                    <QRCode value={upiLink} size={220} />
                  </div>
                </div>

                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#c2410c', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Info size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong>UPI ID:</strong> {UPI_ID}<br />
                      <strong>Amount:</strong> ₹{amount}<br />
                      <strong>To:</strong> {PAYEE_NAME}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep('choose')}
                    style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '14px', padding: '14px', fontWeight: 700, cursor: 'pointer', color: '#475569', fontSize: '0.95rem' }}
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('confirm')}
                    style={{ flex: 2, background: 'linear-gradient(135deg, #E23744, #c0202d)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
                  >
                    I have paid ✓
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirm payment */}
            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      boxShadow: '0 12px 32px rgba(16,185,129,0.35)',
                    }}
                  >
                    <CheckCircle size={40} color="white" />
                  </motion.div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a', marginBottom: '8px' }}>
                    Payment Initiated!
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Confirm your payment by clicking below. Our team will verify and start preparing your order.
                  </p>
                </div>

                {/* Optional Transaction ID */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>
                    UPI Transaction ID <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional but recommended)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012"
                    value={txnId}
                    onChange={e => setTxnId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '1rem',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#f8fafc',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#E23744'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Info box */}
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#1d4ed8', fontSize: '0.88rem', fontWeight: 600 }}>
                    <Info size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>After you confirm, your order status will be set to <strong>"Payment Pending Confirmation"</strong>. The restaurant will verify and start preparing your order within minutes.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setStep('choose')}
                    style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '14px', padding: '16px', fontWeight: 700, cursor: 'pointer', color: '#475569', fontSize: '0.95rem' }}
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handlePaid}
                    style={{
                      flex: 2,
                      background: 'linear-gradient(135deg, #E23744, #c0202d)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      boxShadow: '0 8px 24px rgba(226,55,68,0.3)',
                    }}
                  >
                    ✓ I Have Paid — Confirm Order
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
