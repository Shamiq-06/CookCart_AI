export const pageTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1]
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: pageTransition },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2 } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: pageTransition },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: pageTransition },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: pageTransition }
};

export const buttonMotion = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 420, damping: 24 }
};
