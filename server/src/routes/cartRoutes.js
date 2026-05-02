const express = require("express");
const {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(getCart).post(addItemToCart).delete(clearCart);
router.route("/:itemId").put(updateCartItem).delete(removeCartItem);

module.exports = router;
