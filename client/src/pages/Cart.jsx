import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { buttonMotion, fadeIn, scaleIn, staggerContainer, staggerItem } from "../utils/animations";

const Cart = () => {
  const { cart, total, clearCart } = useCart();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <motion.div className="panel p-5" initial="hidden" animate="visible" variants={scaleIn}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cart</h1>
          {cart.items.length > 0 && <motion.button {...buttonMotion} className="btn-secondary" onClick={clearCart}>Clear</motion.button>}
        </div>
        <motion.div className="mt-4" initial="hidden" animate="visible" variants={staggerContainer}>
          {cart.items.length === 0 ? (
            <motion.p className="py-10 text-center text-slate-500" variants={fadeIn}>Your cart is empty.</motion.p>
          ) : (
            cart.items.map((item) => <CartItem key={item.product || item.name} item={item} />)
          )}
        </motion.div>
        <motion.div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between" variants={staggerItem}>
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          <motion.div {...buttonMotion}>
          <Link className="btn-primary" to="/checkout">Go to Checkout</Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Cart;
