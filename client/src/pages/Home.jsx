import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, CheckCircle2, ChefHat, CreditCard, ListChecks, ShoppingBasket, Sparkles, Truck } from "lucide-react";

const Home = () => (
  <div>
    <section className="bg-mint">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-semibold text-leaf">
            <Sparkles className="h-4 w-4" /> Smart grocery planning
          </p>
          <h1 className="max-w-3xl text-4xl font-bold text-slate-950 md:text-6xl">Cook-Cart AI</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Enter a dish or pantry ingredients, generate a recipe, add missing groceries, and complete a safe sandbox checkout.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/ai-planner"><Bot className="h-4 w-4" /> Plan Meal with AI</Link>
            <Link className="btn-secondary" to="/products"><ShoppingBasket className="h-4 w-4" /> Shop Groceries</Link>
          </div>
        </motion.div>
        <img
          className="h-80 w-full rounded-md object-cover shadow-soft"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
          alt="Fresh groceries"
        />
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
      {[
        ["AI Recipes", "Recipe ideas include ingredients, missing groceries, steps, and health tips.", Bot],
        ["Live Cart", "Add products or AI missing items and update quantities before checkout.", ShoppingBasket],
        ["Sandbox Payment", "Stripe Checkout uses test mode and redirects back to success or cancel pages.", CreditCard]
      ].map(([title, text, Icon]) => (
        <article className="panel p-5" key={title}>
          <Icon className="mb-4 h-8 w-8 text-leaf" />
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{text}</p>
        </article>
      ))}
    </section>
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
          <div className="mt-6 space-y-4">
            {[
              ["Type your dish", "Start with the meal you want to cook, then add pantry ingredients you already have.", ChefHat],
              ["Review missing groceries", "Cook-Cart AI separates required and missing items so the shopping list is clear.", ListChecks],
              ["Track cooking progress", "Follow each cooking step with a live progress bar until the recipe is complete.", CheckCircle2]
            ].map(([title, text, Icon]) => (
              <div className="flex gap-3" key={title}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-mint text-leaf">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
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
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Rice", "Base for fried rice, curries, and bowls"],
            ["Chicken", "Protein for quick dinners"],
            ["Tomato", "Fresh flavor for sauces and salads"],
            ["Spices", "Small packs that make recipes complete"]
          ].map(([name, text]) => (
            <article className="panel p-5" key={name}>
              <h3 className="text-lg font-bold text-slate-900">{name}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="bg-leaf text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Ready to build tonight's cart?</h2>
          <p className="mt-2 max-w-2xl text-emerald-50">Generate a recipe, add missing ingredients, pay in sandbox mode, and come back to step-by-step cooking guidance.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-leaf" to="/ai-planner">
            <Bot className="h-4 w-4" /> Start planning
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white" to="/products">
            <Truck className="h-4 w-4" /> Shop now
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
