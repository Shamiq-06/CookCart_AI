import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancel = () => (
  <section className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-10">
    <div className="panel w-full p-8 text-center">
      <XCircle className="mx-auto h-16 w-16 text-orange-500" />
      <h1 className="mt-4 text-3xl font-bold">Payment Cancelled</h1>
      <p className="mt-2 text-slate-500">The sandbox checkout was cancelled or failed.</p>
      <Link className="btn-primary mt-6" to="/checkout">Try Again</Link>
    </div>
  </section>
);

export default PaymentCancel;
