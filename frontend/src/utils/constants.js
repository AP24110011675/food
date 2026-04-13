export const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`;

export const COLORS = {
  primary: '#ff6b35',
  secondary: '#004e64',
  accent: '#00a5cf',
  success: '#38b000',
  error: '#d00000',
  warning: '#ffb703',
};

export const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out for delivery',
  DELIVERED: 'delivered',
};
