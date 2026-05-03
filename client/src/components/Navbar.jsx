import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, LogOut, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { buttonMotion, fadeIn } from "../utils/animations";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = [
    ["AI Planner", "/ai-planner", true],
    ["Groceries", "/products", true],
    ["Orders", "/orders", Boolean(user)],
    ["Admin", "/admin", isAdmin]
  ];
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-leaf" : "text-slate-600 hover:text-leaf"}`;
  const mobileLinkClass = ({ isActive }) =>
    `shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-emerald-50 text-leaf" : "text-slate-600 hover:bg-slate-50 hover:text-leaf"
    }`;

  return (
    <motion.header
      animate="visible"
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
      initial="hidden"
      variants={fadeIn}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-leaf">
          <Leaf className="h-6 w-6" />
          Cook-Cart AI
        </Link>
        </motion.div>
        <div className="hidden items-center gap-5 md:flex">
          {navItems.map(([label, to, show]) => show && (
            <motion.div key={to} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
              <NavLink className={linkClass} to={to}>{label}</NavLink>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <motion.div {...buttonMotion}>
          <Link to="/cart" className="btn-secondary px-3" title="Cart">
            <ShoppingCart className="h-4 w-4" />
            <span>{count}</span>
          </Link>
          </motion.div>
          {user ? (
            <motion.button {...buttonMotion} onClick={logout} className="btn-secondary px-3" title="Sign out">
              <LogOut className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.div {...buttonMotion}>
            <Link to="/login" className="btn-primary">
              <UserRound className="h-4 w-4" />
              Login
            </Link>
            </motion.div>
          )}
        </div>
      </nav>
      <div className="border-t border-slate-100 md:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {navItems.map(([label, to, show]) => show && (
            <NavLink key={to} className={mobileLinkClass} to={to}>{label}</NavLink>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
