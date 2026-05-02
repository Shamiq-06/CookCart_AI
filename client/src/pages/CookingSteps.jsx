import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import { buttonMotion, fadeIn, scaleIn, staggerContainer, staggerItem } from "../utils/animations";

const getSavedRecipe = () => {
  try {
    return JSON.parse(localStorage.getItem("cookCartActiveRecipe") || "null");
  } catch (error) {
    localStorage.removeItem("cookCartActiveRecipe");
    return null;
  }
};

const CookingSteps = () => {
  const [recipe, setRecipe] = useState(getSavedRecipe);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOrderAccess = async () => {
      const orderId = localStorage.getItem("cookCartActiveOrderId");
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/orders/${orderId}`);
        if (data.recipeAccessBlocked) {
          localStorage.removeItem("cookCartActiveRecipe");
          setRecipe(null);
          setBlocked(true);
        }
      } catch (error) {
        setRecipe(getSavedRecipe());
      } finally {
        setLoading(false);
      }
    };

    checkOrderAccess();
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <motion.div className="mb-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.p className="text-sm font-semibold uppercase text-citrus" variants={staggerItem}>Cooking mode</motion.p>
        <motion.h1 className="text-3xl font-bold text-slate-950" variants={staggerItem}>Follow Your Recipe Steps</motion.h1>
        <motion.p className="mt-2 text-slate-500" variants={staggerItem}>Tick each step as you cook. The progress bar updates live until the dish is complete.</motion.p>
      </motion.div>
      {loading ? (
        <motion.div className="panel p-8 text-center text-slate-500" initial="hidden" animate="visible" variants={fadeIn}>Checking recipe access...</motion.div>
      ) : blocked ? (
        <motion.div className="panel p-8 text-center" initial="hidden" animate="visible" variants={scaleIn}>
          <LockKeyhole className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">Recipe access blocked</h2>
          <p className="mt-2 text-slate-500">This full order was cancelled from My Orders, so the recipe steps for that order are no longer available.</p>
          <motion.div {...buttonMotion}>
          <Link className="btn-primary mt-5" to="/orders">Back to orders</Link>
          </motion.div>
        </motion.div>
      ) : recipe ? (
        <RecipeCard recipe={recipe} />
      ) : (
        <motion.div className="panel p-8 text-center" initial="hidden" animate="visible" variants={scaleIn}>
          <h2 className="text-xl font-bold text-slate-900">No active recipe found</h2>
          <p className="mt-2 text-slate-500">Generate a recipe first, then checkout to return here with the exact cooking steps.</p>
          <motion.div {...buttonMotion}>
          <Link className="btn-primary mt-5" to="/ai-planner">Plan a meal</Link>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default CookingSteps;
