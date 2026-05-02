const express = require("express");
const {
  cancelOrderItem,
  cancelUserOrder,
  createOrder,
  getAllOrders,
  getUserOrderById,
  getUserOrders,
  updateOrderItem,
  updateOrderStatus
} = require("../controllers/orderController");
const { admin, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:orderId", protect, getUserOrderById);
router.put("/:orderId/items/:itemId", protect, updateOrderItem);
router.delete("/:orderId/items/:itemId", protect, cancelOrderItem);
router.put("/:orderId/cancel", protect, cancelUserOrder);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
