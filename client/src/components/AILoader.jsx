import { motion } from "framer-motion";
import { ChefHat, Sparkles } from "lucide-react";
import { fadeIn } from "../utils/animations";

const AILoader = () => (
  <motion.div
    animate="visible"
    className="panel flex min-h-80 flex-col items-center justify-center p-8 text-center"
    exit="exit"
    initial="hidden"
    variants={fadeIn}
  >
    <motion.div
      animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.06, 1] }}
      className="relative flex h-16 w-16 items-center justify-center rounded-full bg-mint text-leaf"
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <ChefHat className="h-8 w-8" />
      <motion.span
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.1, 0.8] }}
        className="absolute -right-1 -top-1 text-citrus"
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-5 w-5" />
      </motion.span>
    </motion.div>
    <h2 className="mt-5 text-xl font-bold text-slate-900">Cooking up your AI recipe...</h2>
    <div className="mt-4 flex gap-2">
      {[0, 1, 2].map((dot) => (
        <motion.span
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -6, 0] }}
          className="h-2.5 w-2.5 rounded-full bg-leaf"
          key={dot}
          transition={{ delay: dot * 0.16, duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  </motion.div>
);

export default AILoader;
