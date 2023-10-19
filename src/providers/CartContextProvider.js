'use client';
import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext(null);

export default function CartContextProvider({children}){
  const [cartItems, setCartItems] = useState([]);

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext(){
  const context = useContext(CartContext);
  if(!context){
    throw new Error("Must be used within a ContextProvider");
  }
  return context;
}