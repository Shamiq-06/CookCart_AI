import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Truck } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { buttonMotion, scaleIn, staggerContainer, staggerItem } from "../utils/animations";

const Checkout = () => {
  const { cart, total } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getActiveRecipe = () => {
    try {
      return JSON.parse(localStorage.getItem("cookCartActiveRecipe") || "null");
    } catch (error) {
      localStorage.removeItem("cookCartActiveRecipe");
      return null;
    }
  };

  const pay = async () => {
    if (!deliveryAddress.trim()) {
      setErrors({ deliveryAddress: "Delivery address is required." });
      return;
    }
    setLoading(true);
    try {
      const recipe = getActiveRecipe();
      if (paymentMethod === "Stripe") {
        const { data } = await api.post("/payment/create-checkout-session", { deliveryAddress, recipe });
        if (data.orderId) localStorage.setItem("cookCartActiveOrderId", data.orderId);
        window.location.href = data.url;
      } else {
        const { data } = await api.post("/orders", { deliveryAddress, paymentMethod: "Cash on Delivery", recipe });
        if (data._id) localStorage.setItem("cookCartActiveOrderId", data._id);
        window.location.href = "/payment-success?cod=true";
      }
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Checkout failed. Please check your order details." });
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_0.8fr]">
      <motion.div className="panel space-y-5 p-5" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.h1 className="text-3xl font-bold" variants={staggerItem}>Checkout</motion.h1>
        <AnimatePresence>
          {errors.form && (
            <motion.p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              {errors.form}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.label className="block" variants={staggerItem}>
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Truck className="h-4 w-4 text-leaf" /> Delivery Address</span>
          <textarea
            className={`input min-h-32 ${errors.deliveryAddress ? "input-error" : ""}`}
            value={deliveryAddress}
            onChange={(e) => {
              setDeliveryAddress(e.target.value);
              setErrors({ ...errors, deliveryAddress: "", form: "" });
            }}
          />
          {errors.deliveryAddress && <p className="field-error">{errors.deliveryAddress}</p>}
        </motion.label>
        <motion.label className="block" variants={staggerItem}>
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><CreditCard className="h-4 w-4 text-leaf" /> Payment Method</span>
          <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option>Stripe</option>
            <option>Cash on Delivery</option>
          </select>
        </motion.label>
        <motion.button {...buttonMotion} disabled={loading || cart.items.length === 0} className="btn-primary" onClick={pay} variants={staggerItem}>
          {loading ? "Redirecting..." : "Pay with Stripe Sandbox"}
        </motion.button>
      </motion.div>
      <motion.aside className="panel h-fit p-5" initial="hidden" animate="visible" variants={scaleIn}>
        <h2 className="text-xl font-bold">Order Summary</h2>
        <motion.div className="mt-4 space-y-3" variants={staggerContainer}>
          {cart.items.map((item) => (
            <motion.div className="flex justify-between text-sm" key={item.product || item.name} variants={staggerItem}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-5 border-t border-slate-100 pt-4 text-lg font-bold">Total: ${total.toFixed(2)}</p>
      </motion.aside>
    </section>
  );
};

export default Checkout;
