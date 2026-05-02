import { Link, NavLink } from "react-router-dom";
import { Leaf, LogOut, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-leaf" : "text-slate-600 hover:text-leaf"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-leaf">
          <Leaf className="h-6 w-6" />
          Cook-Cart AI
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          <NavLink className={linkClass} to="/ai-planner">AI Planner</NavLink>
          <NavLink className={linkClass} to="/products">Groceries</NavLink>
          {user && <NavLink className={linkClass} to="/orders">Orders</NavLink>}
          {isAdmin && <NavLink className={linkClass} to="/admin">Admin</NavLink>}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="btn-secondary px-3" title="Cart">
            <ShoppingCart className="h-4 w-4" />
            <span>{count}</span>
          </Link>
          {user ? (
            <button onClick={logout} className="btn-secondary px-3" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              <UserRound className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
