import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import api from "../api/axios";
import { buttonMotion, fadeIn, scaleIn, staggerContainer, staggerItem } from "../utils/animations";

const emptyProduct = { name: "", category: "", price: "", image: "", stock: "", unit: "", description: "" };
const statuses = ["Processing", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const load = async () => {
    const [productRes, orderRes] = await Promise.all([api.get("/products"), api.get("/orders")]);
    setProducts(productRes.data);
    setOrders(orderRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submitProduct = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["name", "category", "price", "stock", "unit"].forEach((key) => {
      if (!String(form[key] || "").trim()) nextErrors[key] = `${key} is required.`;
    });
    if (form.price !== "" && Number(form.price) < 0) nextErrors.price = "price cannot be negative.";
    if (form.stock !== "" && Number(form.stock) < 0) nextErrors.stock = "stock cannot be negative.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      toast.success(editingId ? "Product updated" : "Product added");
      setForm(emptyProduct);
      setEditingId(null);
      load();
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Product could not be saved." });
    }
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm(product);
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    load();
  };

  const updateStatus = async (id, orderStatus) => {
    await api.put(`/orders/${id}/status`, { orderStatus });
    toast.success("Order updated");
    load();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <motion.h1 className="mb-6 text-3xl font-bold" initial="hidden" animate="visible" variants={staggerItem}>Admin Dashboard</motion.h1>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.form onSubmit={submitProduct} className="panel space-y-3 p-5" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h2 className="text-xl font-bold" variants={staggerItem}>{editingId ? "Update Product" : "Add Product"}</motion.h2>
          <AnimatePresence>
            {errors.form && <motion.p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{errors.form}</motion.p>}
          </AnimatePresence>
          {Object.keys(emptyProduct).map((key) => (
            <motion.label className="block" key={key} variants={staggerItem}>
              <input
                className={`input ${errors[key] ? "input-error" : ""}`}
                placeholder={key}
                value={form[key] || ""}
                onChange={(e) => {
                  setForm({ ...form, [key]: e.target.value });
                  setErrors({ ...errors, [key]: "", form: "" });
                }}
              />
              {errors[key] && <p className="field-error">{errors[key]}</p>}
            </motion.label>
          ))}
          <motion.button {...buttonMotion} className="btn-primary" variants={staggerItem}>{editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />} Save Product</motion.button>
        </motion.form>
        <motion.div className="panel p-5" initial="hidden" animate="visible" variants={scaleIn}>
          <h2 className="mb-4 text-xl font-bold">Products</h2>
          <motion.div className="max-h-[520px] space-y-3 overflow-auto pr-2" variants={staggerContainer}>
            {products.length === 0 && <motion.p className="text-sm text-slate-500" variants={fadeIn}>No products loaded yet.</motion.p>}
            {products.map((product) => (
              <motion.div className="flex items-center justify-between rounded-md bg-slate-50 p-3" key={product._id} variants={staggerItem} whileHover={{ y: -2 }}>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-500">${product.price} | {product.stock} in stock</p>
                </div>
                <div className="flex gap-2">
                  <motion.button {...buttonMotion} className="btn-secondary" onClick={() => edit(product)}>Edit</motion.button>
                  <motion.button {...buttonMotion} className="btn-secondary px-3" onClick={() => remove(product._id)}><Trash2 className="h-4 w-4" /></motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <motion.div className="panel mt-6 p-5" initial="hidden" animate="visible" variants={scaleIn}>
        <h2 className="mb-4 text-xl font-bold">Orders</h2>
        <motion.div className="space-y-3" variants={staggerContainer}>
          {orders.length === 0 && <motion.p className="text-sm text-slate-500" variants={fadeIn}>No orders loaded yet.</motion.p>}
          {orders.map((order) => (
            <motion.div className="grid gap-3 rounded-md bg-slate-50 p-3 md:grid-cols-[1fr_auto_auto]" key={order._id} variants={staggerItem} whileHover={{ y: -2 }}>
              <div>
                <p className="font-semibold">{order.userId?.name || "Customer"} | ${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-slate-500">{order.deliveryAddress}</p>
              </div>
              <span className="text-sm text-leaf">{order.paymentStatus}</span>
              <select className="input md:w-48" value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AdminDashboard;
