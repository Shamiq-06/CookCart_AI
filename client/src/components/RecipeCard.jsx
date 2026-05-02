import { useMemo, useState } from "react";
import { CheckCircle2, Clock, HeartPulse, Home, ListChecks, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { buttonMotion, scaleIn, staggerContainer, staggerItem } from "../utils/animations";

const RecipeCard = ({ recipe, showCartActions = true }) => {
  const { addToCart } = useCart();
  const [doneSteps, setDoneSteps] = useState([]);
  if (!recipe) return null;
  const steps = recipe.steps || [];
  const progress = useMemo(
    () => (steps.length ? Math.round((doneSteps.length / steps.length) * 100) : 0),
    [doneSteps.length, steps.length]
  );

  const addMissing = async () => {
    for (const item of recipe.missingIngredients || []) {
      await addToCart({ name: item, quantity: 1, price: 1.5, unit: "item" });
    }
  };

  const toggleStep = (index) => {
    setDoneSteps((current) => {
      const clickedStepIsLastCompleted = current.length === index + 1;
      if (clickedStepIsLastCompleted) return current.slice(0, index);
      return steps.map((_, stepIndex) => stepIndex).filter((stepIndex) => stepIndex <= index);
    });
  };

  return (
    <motion.section animate="visible" exit="exit" initial="hidden" variants={scaleIn} className="panel border-emerald-100 p-5 shadow-soft">
      <motion.div animate="visible" className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between" initial="hidden" variants={staggerContainer}>
        <motion.div variants={staggerItem}>
          <h2 className="text-2xl font-bold text-slate-900">{recipe.recipeName}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4 text-leaf" /> {recipe.cookingTime}
          </p>
        </motion.div>
        {showCartActions && (
          <motion.button {...buttonMotion} className="btn-primary" onClick={addMissing} variants={staggerItem}>
            <ShoppingBag className="h-4 w-4" />
            Add missing items
          </motion.button>
        )}
      </motion.div>
      <motion.div className="mt-5 grid gap-4 md:grid-cols-2" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerItem}>
          <h3 className="mb-2 font-semibold text-slate-900">Required Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients?.map((item) => (
              <span key={item} className="rounded-md bg-mint px-2 py-1 text-sm text-leaf">{item}</span>
            ))}
          </div>
        </motion.div>
        <motion.div variants={staggerItem}>
          <h3 className="mb-2 font-semibold text-slate-900">Missing Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.missingIngredients?.map((item) => (
              <span key={item} className="rounded-md bg-orange-50 px-2 py-1 text-sm text-orange-700">{item}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
      <motion.div className="mt-5" initial="hidden" animate="visible" variants={staggerContainer}>
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <ListChecks className="h-4 w-4 text-leaf" /> Cooking Steps
          </h3>
          <span className="text-sm font-semibold text-leaf">{progress}% complete</span>
        </div>
        <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-leaf"
            initial={false}
            transition={{ duration: 0.35 }}
          />
        </div>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <motion.li key={step} variants={staggerItem}>
              <motion.button
                {...buttonMotion}
                className={`flex w-full gap-3 rounded-md border p-3 text-left text-sm transition ${
                  doneSteps.includes(index)
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-slate-100 bg-slate-50 text-slate-700 hover:border-leaf/30"
                }`}
                type="button"
                onClick={() => toggleStep(index)}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    doneSteps.includes(index) ? "border-leaf bg-leaf text-white" : "border-slate-300"
                  }`}
                >
                  {doneSteps.includes(index) ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <span>{step}</span>
              </motion.button>
            </motion.li>
          ))}
        </ol>
      </motion.div>
      {progress === 100 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-md bg-leaf p-4 text-white"
          initial={{ opacity: 0, y: 10 }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold">Congratulations, cooking complete!</h3>
              <p className="mt-1 text-sm text-emerald-50">You finished every step for this recipe. Serve it warm and enjoy your meal.</p>
            </div>
            <motion.div {...buttonMotion}>
            <Link className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-leaf transition hover:bg-emerald-50" to="/">
              <Home className="h-4 w-4" />
              Back Home
            </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
      <motion.p className="mt-5 flex gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800" variants={staggerItem}>
        <HeartPulse className="h-4 w-4 shrink-0" /> {recipe.healthTip}
      </motion.p>
    </motion.section>
  );
};

export default RecipeCard;
