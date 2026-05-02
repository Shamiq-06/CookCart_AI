import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { fadeUp } from "./utils/animations";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIRecipePlanner from "./pages/AIRecipePlanner";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import CookingSteps from "./pages/CookingSteps";

const PageShell = ({ children }) => (
  <motion.div animate="visible" exit="exit" initial="hidden" variants={fadeUp}>
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route path="/" element={<PageShell><Home /></PageShell>} />
            <Route path="/login" element={<PageShell><Login /></PageShell>} />
            <Route path="/register" element={<PageShell><Register /></PageShell>} />
            <Route path="/products" element={<PageShell><Products /></PageShell>} />
            <Route path="/payment-success" element={<PageShell><PaymentSuccess /></PageShell>} />
            <Route path="/payment-cancel" element={<PageShell><PaymentCancel /></PageShell>} />
            <Route path="/cooking-steps" element={<ProtectedRoute><PageShell><CookingSteps /></PageShell></ProtectedRoute>} />
            <Route path="/ai-planner" element={<ProtectedRoute><PageShell><AIRecipePlanner /></PageShell></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><PageShell><Cart /></PageShell></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><PageShell><Checkout /></PageShell></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><PageShell><Orders /></PageShell></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><PageShell><AdminDashboard /></PageShell></ProtectedRoute>} />
            <Route path="*" element={<PageShell><Home /></PageShell>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
