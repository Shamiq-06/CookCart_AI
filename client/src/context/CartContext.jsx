import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = useCallback(async () => {
    if (!user) return setCart({ items: [] });
    const { data } = await api.get("/cart");
    setCart(data);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  const addToCart = async (item) => {
    if (!user) {
      toast.custom(
        (toastItem) => (
          <div className={`${toastItem.visible ? "animate-enter" : "animate-leave"} panel flex max-w-md items-center gap-4 p-4`}>
            <div>
              <p className="font-semibold text-slate-900">Login required</p>
              <p className="text-sm text-slate-500">Please login first to add groceries to your cart.</p>
            </div>
            <button className="btn-primary shrink-0" onClick={() => { toast.dismiss(toastItem.id); window.location.href = "/login"; }}>
              Login
            </button>
          </div>
        ),
        { duration: 5000 }
      );
      return;
    }
    const { data } = await api.post("/cart", item);
    setCart(data);
    toast.success("Added to cart");
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${encodeURIComponent(itemId)}`, { quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${encodeURIComponent(itemId)}`);
    setCart(data);
    toast.success("Removed item");
  };

  const clearCart = async () => {
    const { data } = await api.delete("/cart");
    setCart(data);
  };

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = useMemo(
    () => ({ cart, total, fetchCart, addToCart, updateQuantity, removeItem, clearCart }),
    [cart, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
