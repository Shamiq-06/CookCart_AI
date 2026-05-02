import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, CheckCircle2, ChefHat, CreditCard, ListChecks, ShoppingBasket, Sparkles, Truck } from "lucide-react";
import { buttonMotion, fadeUp, staggerContainer, staggerItem } from "../utils/animations";

const Home = () => (
  <div>
    <section className="relative overflow-hidden bg-mint">
      <motion.div
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
        className="absolute -right-20 top-8 h-72 w-72 rounded-full bg-citrus/20 blur-3xl"
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ opacity: [0.25, 0.45, 0.25], y: [0, -18, 0] }}
        className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-leaf/20 blur-3xl"
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <motion.div animate="visible" className="relative z-10" initial="hidden" variants={staggerContainer}>
          <motion.p className="mb-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-semibold text-leaf shadow-soft" variants={staggerItem}>
            <Sparkles className="h-4 w-4" /> Smart grocery planning
          </motion.p>
          <motion.h1 className="max-w-3xl text-4xl font-bold text-slate-950 md:text-6xl" variants={fadeUp}>Cook-Cart AI</motion.h1>
          <motion.p className="mt-4 max-w-2xl text-lg text-slate-600" variants={staggerItem}>
            Enter a dish or pantry ingredients, generate a recipe, add missing groceries, and complete a safe sandbox checkout.
          </motion.p>
          <motion.div className="mt-7 flex flex-wrap gap-3" variants={staggerItem}>
            <motion.div {...buttonMotion}>
            <Link className="btn-primary" to="/ai-planner"><Bot className="h-4 w-4" /> Plan Meal with AI</Link>
            </motion.div>
            <motion.div {...buttonMotion}>
            <Link className="btn-secondary" to="/products"><ShoppingBasket className="h-4 w-4" /> Shop Groceries</Link>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div className="relative z-10" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }}>
          <img
            className="h-80 w-full rounded-md object-cover shadow-soft"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
            alt="Fresh groceries"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            className="absolute -bottom-5 left-5 rounded-md border border-white/70 bg-white/95 p-4 shadow-soft"
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-sm font-semibold text-slate-900">AI cart ready</p>
            <p className="text-xs text-slate-500">Recipe + groceries in one flow</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
    <motion.section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
      {[
        ["AI Recipes", "Recipe ideas include ingredients, missing groceries, steps, and health tips.", Bot],
        ["Live Cart", "Add products or AI missing items and update quantities before checkout.", ShoppingBasket],
        ["Sandbox Payment", "Stripe Checkout uses test mode and redirects back to success or cancel pages.", CreditCard]
      ].map(([title, text, Icon]) => (
        <motion.article className="panel p-5 transition-shadow hover:shadow-soft" key={title} variants={staggerItem} whileHover={{ y: -6 }}>
          <Icon className="mb-4 h-8 w-8 text-leaf" />
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{text}</p>
        </motion.article>
      ))}
    </motion.section>
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <img
          className="h-96 w-full rounded-md object-cover shadow-soft"
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80"
          alt="Cooking fresh ingredients"
        />
        <div>
          <p className="text-sm font-semibold uppercase text-citrus">From idea to dinner</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">Plan the dish, buy what is missing, cook with confidence.</h2>
          <motion.div className="mt-6 space-y-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
            {[
              ["Type your dish", "Start with the meal you want to cook, then add pantry ingredients you already have.", ChefHat],
              ["Review missing groceries", "Cook-Cart AI separates required and missing items so the shopping list is clear.", ListChecks],
              ["Track cooking progress", "Follow each cooking step with a live progress bar until the recipe is complete.", CheckCircle2]
            ].map(([title, text, Icon]) => (
              <motion.div className="flex gap-3" key={title} variants={staggerItem}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-mint text-leaf">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-citrus">Popular grocery picks</p>
            <h2 className="text-3xl font-bold text-slate-950">Everyday essentials for fast meals</h2>
          </div>
          <Link className="btn-secondary" to="/products">Browse all groceries</Link>
        </div>
        <motion.div className="grid gap-4 md:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
          {[
            ["Rice", "Base for fried rice, curries, and bowls"],
            ["Chicken", "Protein for quick dinners"],
            ["Tomato", "Fresh flavor for sauces and salads"],
            ["Spices", "Small packs that make recipes complete"]
          ].map(([name, text]) => (
            <motion.article className="panel p-5 transition-shadow hover:shadow-soft" key={name} variants={staggerItem} whileHover={{ y: -5 }}>
              <h3 className="text-lg font-bold text-slate-900">{name}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
    <section className="bg-leaf text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Ready to build tonight's cart?</h2>
          <p className="mt-2 max-w-2xl text-emerald-50">Generate a recipe, add missing ingredients, pay in sandbox mode, and come back to step-by-step cooking guidance.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.div {...buttonMotion}>
          <Link className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-leaf" to="/ai-planner">
            <Bot className="h-4 w-4" /> Start planning
          </Link>
          </motion.div>
          <motion.div {...buttonMotion}>
          <Link className="inline-flex items-center gap-2 rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white" to="/products">
            <Truck className="h-4 w-4" /> Shop now
          </Link>
          </motion.div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
