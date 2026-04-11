import { useState } from 'react';
import useCartStore from '../stores/useCartStore';

export const useAddToCartAction = (product) => {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (e, quantity = 1) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!product) return;
    
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  return { handleAddToCart, isAdding };
};
