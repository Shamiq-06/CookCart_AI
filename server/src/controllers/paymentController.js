const stripePackage = require("stripe");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const isStripeConfigured = () =>
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");

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

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { deliveryAddress, recipe } = req.body;
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
      paymentStatus: "Paid",
      orderStatus: "Processing",
      paymentMethod: "Stripe"
    });

    cart.items = [];
    await cart.save();

    if (!isStripeConfigured()) {
      return res.json({
        url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}&demo=true`,
        orderId: order._id,
        message: "Stripe test key missing. Demo payment success URL returned."
      });
    }

    const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: `${item.name} (${item.unit})` },
          unit_amount: Math.max(50, Math.round(item.price * 100))
        },
        quantity: item.quantity
      })),
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: { orderId: String(order._id), userId: String(req.user._id) }
    });

    order.stripeSessionId = session.id;
    if (session.payment_intent) order.stripePaymentIntentId = session.payment_intent;
    await order.save();

    res.json({ url: session.url, orderId: order._id });
  } catch (error) {
    next(error);
  }
};
