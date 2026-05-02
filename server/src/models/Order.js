const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "item" },
    itemStatus: { type: String, enum: ["Active", "Cancelled"], default: "Active" },
    refundAmount: { type: Number, default: 0 },
    refundStatus: {
      type: String,
      enum: ["Not Requested", "Not Collected", "Pending", "Refunded", "Failed"],
      default: "Not Requested"
    },
    refundReference: { type: String }
  }
);

const recipeSnapshotSchema = new mongoose.Schema(
  {
    recipeName: { type: String },
    cookingTime: { type: String },
    ingredients: [{ type: String }],
    missingIngredients: [{ type: String }],
    steps: [{ type: String }],
    healthTip: { type: String }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    recipeSnapshot: recipeSnapshotSchema,
    recipeAccessBlocked: { type: Boolean, default: false },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: { type: String, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: {
      type: String,
      enum: ["Processing", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Processing"
    },
    paymentMethod: { type: String, enum: ["Cash on Delivery", "Stripe"], default: "Stripe" },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    totalRefundedAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
