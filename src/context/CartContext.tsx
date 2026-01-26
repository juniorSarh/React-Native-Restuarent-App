import React, { createContext, useContext, useState } from "react";

type SideOption = {
  id: string;
  name: string;
  price: number;
  included: boolean; // Whether price is included in base price
};

type DrinkOption = {
  id: string;
  name: string;
  price: number;
  included: boolean;
};

type Extra = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Customization = {
  selectedSides: string[]; // Array of side IDs
  selectedDrinks: string[]; // Array of drink IDs
  extras: Extra[]; // Array of extras with quantities
  removedIngredients: string[]; // Array of ingredient names to remove
  addedIngredients: string[]; // Array of ingredient names to add
  specialInstructions: string;
};

type CartItem = {
  id: string; // Unique ID for this cart item (combination of foodId + customization)
  foodId: string;
  name: string;
  basePrice: number;
  quantity: number;
  imageUrl?: string;
  customization: Customization;
  totalPrice: number; // Base price + customization additions
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "totalPrice">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Generate unique ID based on food item and customization
  const generateCartItemId = (foodId: string, customization: Customization): string => {
    const customString = JSON.stringify(customization);
    return `${foodId}-${btoa(customString).slice(0, 8)}`;
  };

  // Calculate total price for a cart item
  const calculateTotalPrice = (basePrice: number, customization: Customization): number => {
    let total = basePrice;
    
    // Add extras (excluding included items)
    customization.extras.forEach(extra => {
      total += extra.price * extra.quantity;
    });
    
    return total;
  };

  const addToCart = (item: Omit<CartItem, "id" | "totalPrice">) => {
    const id = generateCartItemId(item.foodId, item.customization);
    const totalPrice = calculateTotalPrice(item.basePrice, item.customization);
    
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i =>
          i.id === id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, id, totalPrice }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
