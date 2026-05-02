import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { buttonMotion, scaleIn } from "../utils/animations";

const PaymentCancel = () => (
  <section className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-10">
    <motion.div className="panel w-full p-8 text-center" initial="hidden" animate="visible" variants={scaleIn}>
      <XCircle className="mx-auto h-16 w-16 text-orange-500" />
      <h1 className="mt-4 text-3xl font-bold">Payment Cancelled</h1>
      <p className="mt-2 text-slate-500">The sandbox checkout was cancelled or failed.</p>
      <motion.div {...buttonMotion}>
      <Link className="btn-primary mt-6" to="/checkout">Try Again</Link>
      </motion.div>
    </motion.div>
  </section>
);

export default PaymentCancel;
