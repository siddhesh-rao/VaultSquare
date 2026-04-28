import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === product._id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentItems,
        {
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.buyPrice,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
