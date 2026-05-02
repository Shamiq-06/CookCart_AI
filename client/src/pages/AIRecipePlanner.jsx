import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AILoader from "../components/AILoader";
import RecipeCard from "../components/RecipeCard";
import { buttonMotion, fadeIn, staggerContainer, staggerItem } from "../utils/animations";

const AIRecipePlanner = () => {
  const [dishName, setDishName] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const addIngredient = () => {
    const next = ingredientInput.trim();
    if (!next) return;
    if (!availableIngredients.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setAvailableIngredients((items) => [...items, next]);
    }
    setIngredientInput("");
  };

  const removeIngredient = (ingredient) => {
    setAvailableIngredients((items) => items.filter((item) => item !== ingredient));
  };

  const generate = async (event) => {
    event.preventDefault();
    if (!dishName.trim()) {
      setErrors({ dishName: "Please type a dish name before generating a recipe." });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/ai/generate-recipe", { dishName, availableIngredients });
      setRecipe(data);
      localStorage.setItem("cookCartActiveRecipe", JSON.stringify(data));
      toast.success("Recipe generated");
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "AI planner failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[0.85fr_1.15fr]">
      <motion.form animate="visible" initial="hidden" onSubmit={generate} className="panel h-fit space-y-4 p-5" variants={staggerContainer}>
        <motion.h1 className="flex items-center gap-2 text-2xl font-bold" variants={staggerItem}><Bot className="h-6 w-6 text-leaf" /> AI Recipe Planner</motion.h1>
        <AnimatePresence>
          {errors.form && (
            <motion.p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              {errors.form}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.label className="block" variants={staggerItem}>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Dish name</span>
          <input
            className={`input ${errors.dishName ? "input-error" : ""}`}
            placeholder="Chicken fried rice"
            value={dishName}
            onChange={(e) => {
              setDishName(e.target.value);
              setErrors({ ...errors, dishName: "", form: "" });
            }}
          />
          {errors.dishName && <p className="field-error">{errors.dishName}</p>}
        </motion.label>
        <motion.label className="block" variants={staggerItem}>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Available ingredients</span>
          <input
            className="input"
            placeholder="Type tomato and press Enter"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addIngredient();
              }
            }}
          />
        </motion.label>
        <motion.div className="min-h-12 rounded-md border border-dashed border-slate-200 bg-slate-50 p-3" variants={staggerItem}>
          {availableIngredients.length === 0 ? (
            <motion.p className="text-sm text-slate-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No ingredients added. The planner will mark every required ingredient as missing.</motion.p>
          ) : (
            <motion.div className="flex flex-wrap gap-2" initial="hidden" animate="visible" variants={staggerContainer}>
              {availableIngredients.map((ingredient) => (
                <motion.button
                  {...buttonMotion}
                  className="inline-flex items-center gap-1 rounded-md bg-mint px-2 py-1 text-sm font-medium text-leaf"
                  key={ingredient}
                  type="button"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient}
                  <X className="h-3 w-3" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
        <motion.button {...buttonMotion} disabled={loading} className="btn-primary w-full" variants={staggerItem}>{loading ? "Generating..." : "Generate Recipe"}</motion.button>
      </motion.form>
      <AnimatePresence mode="wait">
        {loading ? (
          <AILoader key="loader" />
        ) : recipe ? (
          <RecipeCard key="recipe" recipe={recipe} />
        ) : (
          <motion.div key="empty" className="panel flex min-h-80 items-center justify-center p-8 text-center text-slate-500" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
            Your generated recipe appears here.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AIRecipePlanner;
