import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronDown, ChefHat, ListChecks, MinusCircle, Save, XCircle } from "lucide-react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import { buttonMotion, fadeIn, staggerContainer, staggerItem } from "../utils/animations";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [recipeOpen, setRecipeOpen] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({});

  const loadOrders = async () => {
    const { data } = await api.get("/orders/my-orders");
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderInState = (updatedOrder) => {
    setOrders((current) => current.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)));
  };

  const updateItem = async (orderId, itemId) => {
    try {
      const quantity = quantities[itemId];
      if (quantity !== undefined && Number(quantity) < 1) {
        setErrors({ ...errors, [itemId]: "Quantity must be at least 1." });
        return;
      }
      const { data } = await api.put(`/orders/${orderId}/items/${itemId}`, { quantity });
      updateOrderInState(data);
      setErrors({ ...errors, [itemId]: "" });
      toast.success("Order item updated");
    } catch (error) {
      setErrors({ ...errors, [itemId]: error.response?.data?.message || "Could not update item." });
    }
  };

  const cancelItem = async (orderId, itemId) => {
    try {
      const { data } = await api.delete(`/orders/${orderId}/items/${itemId}`);
      updateOrderInState(data.order || data);
      setErrors({ ...errors, [itemId]: "" });
      toast.success(data.message || "Item cancelled and refund updated");
    } catch (error) {
      setErrors({ ...errors, [itemId]: error.response?.data?.message || "Could not cancel item." });
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      updateOrderInState(data.order || data);
      setErrors({ ...errors, [orderId]: "" });
      if (localStorage.getItem("cookCartActiveOrderId") === orderId) {
        localStorage.removeItem("cookCartActiveRecipe");
        localStorage.removeItem("cookCartActiveOrderId");
      }
      toast.success(data.message || "Order cancelled and refund updated");
    } catch (error) {
      setErrors({ ...errors, [orderId]: error.response?.data?.message || "Could not cancel order." });
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <motion.div className="mb-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.h1 className="text-3xl font-bold" variants={staggerItem}>My Orders</motion.h1>
        <motion.p className="mt-2 text-slate-500" variants={staggerItem}>Expand an order to adjust quantities or cancel items while it is still processing.</motion.p>
      </motion.div>
      <motion.div className="space-y-4" initial="hidden" animate="visible" variants={staggerContainer}>
        {orders.length === 0 && (
          <motion.div className="panel p-8 text-center text-slate-500" variants={fadeIn}>
            You do not have any orders yet.
          </motion.div>
        )}
        {orders.map((order) => (
          <motion.article className="panel p-5 transition-shadow hover:shadow-soft" key={order._id} variants={staggerItem} whileHover={{ y: -3 }}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-bold">Order #{order._id.slice(-6)}</h2>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                {order.recipeSnapshot?.recipeName && (
                  <p className="mt-1 inline-flex items-center gap-2 rounded-md bg-mint px-2 py-1 text-sm font-semibold text-leaf">
                    <ChefHat className="h-4 w-4" />
                    For {order.recipeSnapshot.recipeName}
                  </p>
                )}
              </div>
              <div className="flex gap-2 text-sm">
                <span className="rounded-md bg-mint px-2 py-1 text-leaf">{order.paymentStatus}</span>
                <span className="rounded-md bg-orange-50 px-2 py-1 text-orange-700">{order.orderStatus}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold">${order.totalAmount.toFixed(2)} remaining</p>
                {(order.totalRefundedAmount || 0) > 0 && (
                  <p className="text-sm font-medium text-emerald-700">
                    ${order.totalRefundedAmount.toFixed(2)} refunded to user
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.button {...buttonMotion} className="btn-secondary" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <ChevronDown className="h-4 w-4" /> {expanded === order._id ? "Hide Order" : "Inspect Order"}
                </motion.button>
                {["Processing", "Packed"].includes(order.orderStatus) && (
                  <motion.button {...buttonMotion} className="btn-secondary text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => cancelOrder(order._id)}>
                    <XCircle className="h-4 w-4" /> Cancel Order
                  </motion.button>
                )}
              </div>
            </div>
            <AnimatePresence>
            {expanded === order._id && (
              <motion.div className="mt-5 space-y-3 border-t border-slate-100 pt-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }}>
                <AnimatePresence>
                  {errors[order._id] && <motion.p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{errors[order._id]}</motion.p>}
                </AnimatePresence>
                {order.recipeSnapshot?.recipeName ? (
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase text-citrus">Recipe ordered for</p>
                        <h3 className="text-xl font-bold text-slate-950">{order.recipeSnapshot.recipeName}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.recipeSnapshot.cookingTime || "Cooking time not listed"} | {order.recipeSnapshot.ingredients?.length || 0} ingredients
                        </p>
                      </div>
                      {order.recipeAccessBlocked ? (
                        <span className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                          Recipe blocked after full cancellation
                        </span>
                      ) : (
                        <motion.button
                          {...buttonMotion}
                          className="btn-primary"
                          onClick={() => setRecipeOpen(recipeOpen === order._id ? null : order._id)}
                        >
                          <ListChecks className="h-4 w-4" />
                          {recipeOpen === order._id ? "Hide Recipe Steps" : "View Recipe Steps"}
                        </motion.button>
                      )}
                    </div>
                    <div className="mt-4">
                      <h4 className="mb-2 font-semibold text-slate-900">Recipe Ingredients</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.recipeSnapshot.ingredients?.map((ingredient) => (
                          <span className="rounded-md bg-white px-2 py-1 text-sm text-leaf" key={ingredient}>{ingredient}</span>
                        ))}
                      </div>
                    </div>
                    <AnimatePresence>
                    {recipeOpen === order._id && !order.recipeAccessBlocked && (
                      <motion.div className="mt-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
                        <RecipeCard recipe={order.recipeSnapshot} showCartActions={false} />
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div className="rounded-md bg-slate-50 p-4 text-sm text-slate-500" variants={fadeIn}>
                    This order was not linked to an AI recipe. New checkouts from the AI planner will show recipe details here.
                  </motion.div>
                )}
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">Ordered Grocery Items</h3>
                </div>
                {order.items.map((item) => {
                  const itemId = item._id;
                  const editable = itemId && ["Processing", "Packed"].includes(order.orderStatus) && item.itemStatus !== "Cancelled";
                  return (
                    <motion.div className={`rounded-md p-3 ${item.itemStatus === "Cancelled" ? "bg-red-50 text-red-800" : "bg-slate-50"}`} key={item._id || item.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-500">${item.price.toFixed(2)} / {item.unit} | {item.itemStatus || "Active"}</p>
                        {(item.refundAmount || 0) > 0 && (
                          <p className="mt-1 text-sm font-semibold text-emerald-700">
                            Refund: ${item.refundAmount.toFixed(2)} | {item.refundStatus}
                          </p>
                        )}
                        {item.refundReference && (
                          <p className="text-xs text-slate-500">Reference: {item.refundReference}</p>
                        )}
                      </div>
                      <input
                        className={`input md:w-24 ${errors[itemId] ? "input-error" : ""}`}
                        disabled={!editable}
                        min="1"
                        type="number"
                        value={quantities[itemId] ?? item.quantity}
                        onChange={(event) => setQuantities({ ...quantities, [itemId]: Number(event.target.value) })}
                      />
                      <motion.button {...buttonMotion} className="btn-secondary" disabled={!editable} onClick={() => updateItem(order._id, itemId)}>
                        <Save className="h-4 w-4" /> Update
                      </motion.button>
                      <motion.button {...buttonMotion} className="btn-secondary text-red-600 hover:border-red-200 hover:text-red-700" disabled={!editable} onClick={() => cancelItem(order._id, itemId)}>
                        <MinusCircle className="h-4 w-4" /> Cancel Item
                      </motion.button>
                    </div>
                    {errors[itemId] && <p className="field-error">{errors[itemId]}</p>}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
            </AnimatePresence>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Orders;
