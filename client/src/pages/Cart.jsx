import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, total, clearCart } = useCart();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="panel p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cart</h1>
          {cart.items.length > 0 && <button className="btn-secondary" onClick={clearCart}>Clear</button>}
        </div>
        <div className="mt-4">
          {cart.items.length === 0 ? (
            <p className="py-10 text-center text-slate-500">Your cart is empty.</p>
          ) : (
            cart.items.map((item) => <CartItem key={item.product || item.name} item={item} />)
          )}
        </div>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          <Link className="btn-primary" to="/checkout">Go to Checkout</Link>
        </div>
      </div>
    </section>
  );
};

export default Cart;
