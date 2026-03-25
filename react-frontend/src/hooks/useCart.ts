// import { useContext } from 'react';
// import { CartContext } from '../context/CartContext';

// export const useCart = () => {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error('useCart must be used within CartProvider');
//   }

//   return context;
// };

import { useCartStore } from "../store/useCartStore";

export const useCart = () => useCartStore();