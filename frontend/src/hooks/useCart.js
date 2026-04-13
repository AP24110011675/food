import { useContext } from 'react';
import { CartContext } from '../context/CartContextInstance';

export const useCart = () => useContext(CartContext);
