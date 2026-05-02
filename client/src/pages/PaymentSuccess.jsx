import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { buttonMotion, scaleIn } from "../utils/animations";

const PaymentSuccess = () => {
  const [hasRecipe] = useState(() => Boolean(localStorage.getItem("cookCartActiveRecipe")));

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-10">
      <motion.div initial="hidden" animate="visible" variants={scaleIn} className="panel w-full p-8 text-center">
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.7 }}>
          <CheckCircle2 className="mx-auto h-16 w-16 text-leaf" />
        </motion.div>
        <h1 className="mt-4 text-3xl font-bold">Payment Successful</h1>
        <p className="mt-2 text-slate-500">
          {hasRecipe
            ? "Your order is confirmed. Continue to the exact recipe steps when you are ready."
            : "Your order is confirmed and marked as Processing."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <motion.div {...buttonMotion}>
          <Link className="btn-primary" to={hasRecipe ? "/cooking-steps" : "/orders"}>
            {hasRecipe ? "Continue Cooking" : "View Orders"}
          </Link>
          </motion.div>
          <motion.div {...buttonMotion}>
          <Link className="btn-secondary" to="/orders">View Orders</Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PaymentSuccess;
