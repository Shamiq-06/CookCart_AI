import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { buttonMotion, scaleIn, staggerContainer, staggerItem } from "../utils/animations";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password.trim()) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "Login failed. Please check your details." });
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <motion.form animate="visible" initial="hidden" onSubmit={submit} className="panel space-y-4 p-6" variants={staggerContainer}>
        <motion.h1 className="text-2xl font-bold" variants={scaleIn}>Login</motion.h1>
        <AnimatePresence>
          {errors.form && (
            <motion.p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              {errors.form}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.label className="block" variants={staggerItem}>
          <input
            className={`input ${errors.email ? "input-error" : ""}`}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors({ ...errors, email: "", form: "" });
            }}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </motion.label>
        <motion.label className="block" variants={staggerItem}>
          <input
            className={`input ${errors.password ? "input-error" : ""}`}
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setErrors({ ...errors, password: "", form: "" });
            }}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </motion.label>
        <motion.button {...buttonMotion} className="btn-primary w-full" variants={staggerItem}>Login</motion.button>
        <motion.p className="text-sm text-slate-500" variants={staggerItem}>New here? <Link className="font-semibold text-leaf" to="/register">Create account</Link></motion.p>
      </motion.form>
    </section>
  );
};

export default Login;
