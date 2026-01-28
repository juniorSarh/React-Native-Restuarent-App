import React, { createContext, useContext, useState } from 'react';

export interface CartCustomization {
  selectedSides: string[];
  selectedDrinks: string[];
  extras: { id: string; quantity: number }[];
  specialInstructions: string;
}

export interface CartItem {
  cartItemId: string; // UNIQUE per cart item
  foodId: string;
  name: string;
  basePrice: number;
  quantity: number;
  imageUrl?: string;
  customization: CartCustomization;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItem: (cartItemId: string, item: Omit<CartItem, 'cartItemId'>) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    setItems(prev => [
      ...prev,
      { ...item, cartItemId: Date.now().toString() },
    ]);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateCartItem = (cartItemId: string, updatedItem: Omit<CartItem, 'cartItemId'>) => {
    setItems(prev =>
      prev.map(i =>
        i.cartItemId === cartItemId
          ? { ...updatedItem, cartItemId }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
