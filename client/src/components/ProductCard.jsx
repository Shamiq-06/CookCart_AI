import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { buttonMotion, staggerItem } from "../utils/animations";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.article
      layout
      className="panel overflow-hidden transition-shadow hover:border-emerald-100 hover:shadow-soft"
      variants={staggerItem}
      whileHover={{ y: -6 }}
    >
      <img className="h-44 w-full object-cover" src={product.image} alt={product.name} />
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-citrus">{product.category}</p>
          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-leaf">${product.price.toFixed(2)} / {product.unit}</span>
          <motion.button {...buttonMotion} className="btn-primary px-3" onClick={() => addToCart({ productId: product._id, quantity: 1 })}>
            <Plus className="h-4 w-4" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
