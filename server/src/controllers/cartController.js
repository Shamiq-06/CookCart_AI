const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, name, price = 0, unit = "item" } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    let itemPayload;
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }
      itemPayload = {
        product: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: Number(quantity)
      };
    } else {
      // AI missing items may not exist in products yet, so we create a virtual cart line.
      itemPayload = {
        product: undefined,
        name,
        price: Number(price),
        unit,
        quantity: Number(quantity)
      };
    }

    const existing = cart.items.find((item) => item.name.toLowerCase() === itemPayload.name.toLowerCase());
    if (existing) existing.quantity += itemPayload.quantity;
    else cart.items.push(itemPayload);

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((line) => line.name === req.params.itemId || String(line.product) === req.params.itemId);

    if (!item) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    item.quantity = Math.max(1, Number(quantity));
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((line) => line.name !== req.params.itemId && String(line.product) !== req.params.itemId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
