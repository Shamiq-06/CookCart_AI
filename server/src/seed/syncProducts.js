const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const products = require("./seedProducts");

dotenv.config();

const syncProducts = async () => {
  try {
    await connectDB();

    const names = products.map((product) => product.name);
    let changed = 0;

    for (const product of products) {
      const result = await Product.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true }
      );
      changed += result.modifiedCount + result.upsertedCount;
    }

    await Product.deleteMany({ name: { $nin: names } });

    const count = await Product.countDocuments();
    console.log(`Product catalog synced: ${count} products (${changed} changed or inserted).`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

syncProducts();
