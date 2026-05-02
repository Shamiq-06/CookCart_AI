import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const itemId = item.product || item.name;

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-semibold text-slate-900">{item.name}</h3>
        <p className="text-sm text-slate-500">${item.price.toFixed(2)} / {item.unit}</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          className="input w-20"
          min="1"
          type="number"
          value={item.quantity}
          onChange={(event) => updateQuantity(itemId, Number(event.target.value))}
        />
        <p className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        <button className="btn-secondary px-3" onClick={() => removeItem(itemId)} title="Remove item">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
