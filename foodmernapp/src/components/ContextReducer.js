
import React, { createContext, useContext, useReducer, useEffect } from "react";

// Cart State Context and Dispatch Context
const CartStateContext = createContext();
const CartDispatchContext = createContext();

// Reducer to handle cart actions
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          id: new Date().getTime(),
          name: action.payload.name,
          qty: parseInt(action.payload.qty) || 1,
          price: parseFloat(action.payload.price) || 0,
          img: action.payload.imgSrc
        },
      ];
    case "REMOVE":
      return state.filter((_, index) => index !== action.index); // Remove item by index
    case "DROP":
      return []; // Clear the cart
    case "LOAD":
      return action.payload; // Load items from local storage
    default:
      console.error("Unknown action type:", action.type);
      return state;
  }
};

// CartProvider to provide state and dispatch context
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    // Load cart from local storage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch({ type: "LOAD", payload: storedCart });
  }, []);

  useEffect(() => {
    // Save cart to local storage
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

// Custom hooks to access the state and dispatch
export const useCart = () => useContext(CartStateContext);
export const useCartDispatch = () => useContext(CartDispatchContext);