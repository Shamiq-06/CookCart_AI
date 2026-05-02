const Cart = require("../models/Cart");
const Order = require("../models/Order");
const stripePackage = require("stripe");

const buildRecipeSnapshot = (recipe) => {
  if (!recipe || !recipe.recipeName) return undefined;
  return {
    recipeName: recipe.recipeName,
    cookingTime: recipe.cookingTime,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    missingIngredients: Array.isArray(recipe.missingIngredients) ? recipe.missingIngredients : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    healthTip: recipe.healthTip
  };
};

const recalculateOrder = (order) => {
  order.totalAmount = order.items
    .filter((item) => item.itemStatus !== "Cancelled")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  order.totalRefundedAmount = order.items.reduce((sum, item) => sum + (item.refundAmount || 0), 0);

  if (order.items.length && order.items.every((item) => item.itemStatus === "Cancelled")) {
    order.orderStatus = "Cancelled";
  }
};

const isStripeConfigured = () =>
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");

const processRefundForItem = async (order, item) => {
  if (item.refundStatus === "Refunded" || item.refundStatus === "Pending") {
    return {
      amount: item.refundAmount || item.price * item.quantity,
      message: `${item.name} is already marked for refund.`
    };
  }

  const refundAmount = Number((item.price * item.quantity).toFixed(2));
  item.refundAmount = refundAmount;

  if (order.paymentStatus !== "Paid") {
    item.refundStatus = "Not Collected";
    item.refundReference = "No payment collected yet";
    return {
      amount: refundAmount,
      message: `${item.name} cancelled. No payment was collected yet, so no refund is needed.`
    };
  }

  if (order.paymentMethod === "Stripe" && isStripeConfigured() && order.stripePaymentIntentId) {
    try {
      const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
        amount: Math.round(refundAmount * 100)
      });
      item.refundStatus = refund.status === "succeeded" ? "Refunded" : "Pending";
      item.refundReference = refund.id;
      return {
        amount: refundAmount,
        message: `${item.name} cancelled. $${refundAmount.toFixed(2)} refund sent through Stripe sandbox.`
      };
    } catch (error) {
      item.refundStatus = "Pending";
      item.refundReference = "Stripe refund pending manual review";
      return {
        amount: refundAmount,
        message: `${item.name} cancelled. $${refundAmount.toFixed(2)} refund is recorded and pending because Stripe could not complete it automatically.`
      };
    }
  }

  item.refundStatus = "Refunded";
  item.refundReference = order.paymentMethod === "Stripe" ? "Sandbox/demo refund" : "Cash refund adjustment";
  return {
    amount: refundAmount,
    message: `${item.name} cancelled. $${refundAmount.toFixed(2)} refund returned to the user in sandbox mode.`
  };
};

const assertEditable = (order, userId) => {
  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(order.userId) !== String(userId)) {
    const error = new Error("You can edit only your own orders");
    error.statusCode = 403;
    throw error;
  }

  if (!["Processing", "Packed"].includes(order.orderStatus)) {
    const error = new Error("This order can no longer be edited");
    error.statusCode = 400;
    throw error;
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod = "Cash on Delivery", recipe } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      userId: req.user._id,
      items: cart.items,
      recipeSnapshot: buildRecipeSnapshot(recipe),
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      orderStatus: "Processing"
    });

    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getUserOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.user._id });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true, runValidators: true }
    );
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderItem = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    assertEditable(order, req.user._id);

    const item = order.items.id(req.params.itemId);
    if (!item) {
      res.status(404);
      throw new Error("Order item not found");
    }

    item.quantity = Math.max(1, Number(req.body.quantity || item.quantity));
    item.itemStatus = "Active";
    recalculateOrder(order);
    await order.save();
    res.json(order);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

exports.cancelOrderItem = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    assertEditable(order, req.user._id);

    const item = order.items.id(req.params.itemId);
    if (!item) {
      res.status(404);
      throw new Error("Order item not found");
    }

    const refund = await processRefundForItem(order, item);
    item.itemStatus = "Cancelled";
    recalculateOrder(order);
    await order.save();
    res.json({ order, message: refund.message, refundAmount: refund.amount });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

exports.cancelUserOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    assertEditable(order, req.user._id);

    let totalRefund = 0;
    const messages = [];
    for (const item of order.items) {
      if (item.itemStatus === "Cancelled") continue;
      const refund = await processRefundForItem(order, item);
      totalRefund += refund.amount;
      messages.push(refund.message);
      item.itemStatus = "Cancelled";
    }
    order.orderStatus = "Cancelled";
    order.recipeAccessBlocked = true;
    recalculateOrder(order);
    await order.save();
    res.json({
      order,
      refundAmount: totalRefund,
      message:
        totalRefund > 0
          ? `Order cancelled. Total refund: $${totalRefund.toFixed(2)}.`
          : messages[0] || "Order cancelled."
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
