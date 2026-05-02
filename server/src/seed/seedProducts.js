const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");

dotenv.config();

const products = [
  { name: "Rice", category: "Grains", price: 2.5, image: "/images/products/rice.png", stock: 100, unit: "1 kg", description: "Premium white rice for daily meals." },
  { name: "Chicken", category: "Meat", price: 6.75, image: "/images/products/chicken.png", stock: 50, unit: "1 kg", description: "Fresh chicken cuts for curries and fried rice." },
  { name: "Egg", category: "Dairy", price: 0.35, image: "/images/products/egg.png", stock: 200, unit: "piece", description: "Farm fresh eggs." },
  { name: "Onion", category: "Vegetables", price: 1.2, image: "/images/products/onion.png", stock: 80, unit: "1 kg", description: "Aromatic onions for cooking bases." },
  { name: "Tomato", category: "Vegetables", price: 1.4, image: "/images/products/tomato.png", stock: 70, unit: "1 kg", description: "Juicy tomatoes for sauces and salads." },
  { name: "Potato", category: "Vegetables", price: 1.1, image: "/images/products/potato.png", stock: 90, unit: "1 kg", description: "Versatile potatoes for every kitchen." },
  { name: "Carrot", category: "Vegetables", price: 1.6, image: "/images/products/carrot.png", stock: 75, unit: "1 kg", description: "Crunchy carrots rich in color and nutrients." },
  { name: "Milk", category: "Dairy", price: 1.8, image: "/images/products/milk.png", stock: 60, unit: "1 L", description: "Fresh milk for tea, coffee, and recipes." },
  { name: "Bread", category: "Bakery", price: 2.0, image: "/images/products/bread.png", stock: 40, unit: "loaf", description: "Soft sandwich bread." },
  { name: "Cheese", category: "Dairy", price: 3.9, image: "/images/products/cheese.png", stock: 35, unit: "pack", description: "Creamy cheese for snacks and pasta." },
  { name: "Pasta", category: "Grains", price: 2.25, image: "/images/products/pasta.png", stock: 65, unit: "500 g", description: "Dry pasta for quick dinners." },
  { name: "Noodles", category: "Grains", price: 1.75, image: "/images/products/noodles.png", stock: 85, unit: "pack", description: "Quick-cooking noodles." },
  { name: "Spices", category: "Pantry", price: 2.8, image: "/images/products/spices.png", stock: 55, unit: "pack", description: "Mixed spices for flavorful dishes." },
  { name: "Apples", category: "Fruits", price: 3.2, image: "/images/products/apples.png", stock: 90, unit: "1 kg", description: "Crisp red apples for snacks and desserts." },
  { name: "Bananas", category: "Fruits", price: 1.6, image: "/images/products/bananas.png", stock: 120, unit: "1 kg", description: "Sweet ripe bananas for smoothies and breakfast." },
  { name: "Oranges", category: "Fruits", price: 2.9, image: "/images/products/oranges.png", stock: 85, unit: "1 kg", description: "Juicy oranges packed with bright citrus flavor." },
  { name: "Grapes", category: "Fruits", price: 4.5, image: "/images/products/grapes.png", stock: 55, unit: "500 g", description: "Fresh grapes for snacking and fruit bowls." },
  { name: "Lettuce", category: "Vegetables", price: 1.9, image: "/images/products/lettuce.png", stock: 65, unit: "head", description: "Leafy lettuce for salads, wraps, and sandwiches." },
  { name: "Cucumber", category: "Vegetables", price: 1.3, image: "/images/products/cucumber.png", stock: 80, unit: "500 g", description: "Cool cucumbers for salads and fresh sides." },
  { name: "Bell Pepper", category: "Vegetables", price: 2.7, image: "/images/products/bell-pepper.png", stock: 70, unit: "500 g", description: "Colorful bell peppers for stir-fries and salads." },
  { name: "Broccoli", category: "Vegetables", price: 2.4, image: "/images/products/broccoli.png", stock: 60, unit: "500 g", description: "Fresh broccoli florets for healthy meals." },
  { name: "Cauliflower", category: "Vegetables", price: 2.6, image: "/images/products/cauliflower.png", stock: 55, unit: "head", description: "Tender cauliflower for curries, roasts, and sides." },
  { name: "Spinach", category: "Vegetables", price: 1.8, image: "/images/products/spinach.png", stock: 75, unit: "bunch", description: "Fresh spinach leaves for cooking and salads." },
  { name: "Garlic", category: "Vegetables", price: 1.1, image: "/images/products/garlic.png", stock: 95, unit: "100 g", description: "Aromatic garlic bulbs for everyday cooking." },
  { name: "Ginger", category: "Vegetables", price: 1.4, image: "/images/products/ginger.png", stock: 80, unit: "250 g", description: "Fresh ginger root for spice, tea, and marinades." },
  { name: "Beef", category: "Meat", price: 9.5, image: "/images/products/beef.png", stock: 35, unit: "1 kg", description: "Fresh beef cuts for steaks, curries, and stews." },
  { name: "Fish", category: "Seafood", price: 7.8, image: "/images/products/fish.png", stock: 40, unit: "1 kg", description: "Fresh whole fish for grilling and curries." },
  { name: "Shrimp", category: "Seafood", price: 8.6, image: "/images/products/shrimp.png", stock: 45, unit: "500 g", description: "Clean shrimp for quick seafood dishes." },
  { name: "Yogurt", category: "Dairy", price: 2.2, image: "/images/products/yogurt.png", stock: 50, unit: "500 g", description: "Plain creamy yogurt for breakfast and sauces." },
  { name: "Butter", category: "Dairy", price: 3.4, image: "/images/products/butter.png", stock: 45, unit: "250 g", description: "Creamy butter for baking and cooking." },
  { name: "Flour", category: "Pantry", price: 1.9, image: "/images/products/flour.png", stock: 100, unit: "1 kg", description: "All-purpose flour for baking and batters." },
  { name: "Sugar", category: "Pantry", price: 1.7, image: "/images/products/sugar.png", stock: 100, unit: "1 kg", description: "White sugar for drinks, desserts, and baking." },
  { name: "Salt", category: "Pantry", price: 0.8, image: "/images/products/salt.png", stock: 120, unit: "500 g", description: "Kitchen salt for seasoning daily meals." },
  { name: "Cooking Oil", category: "Pantry", price: 4.2, image: "/images/products/cooking-oil.png", stock: 70, unit: "1 L", description: "Cooking oil for frying, sauteing, and meal prep." },
  { name: "Tea", category: "Beverages", price: 3.1, image: "/images/products/tea.png", stock: 60, unit: "pack", description: "Rich tea for a warm daily cup." },
  { name: "Coffee", category: "Beverages", price: 5.4, image: "/images/products/coffee.png", stock: 55, unit: "pack", description: "Bold coffee for mornings and desserts." },
  { name: "Lentils", category: "Pantry", price: 2.0, image: "/images/products/lentils.png", stock: 90, unit: "500 g", description: "Nutritious lentils for soups, dhal, and curries." },
  { name: "Chickpeas", category: "Pantry", price: 2.3, image: "/images/products/chickpeas.png", stock: 85, unit: "500 g", description: "Hearty chickpeas for salads, hummus, and curries." },
  { name: "Oats", category: "Grains", price: 2.6, image: "/images/products/oats.png", stock: 70, unit: "500 g", description: "Rolled oats for breakfast bowls and baking." },
  { name: "Cereal", category: "Grains", price: 3.8, image: "/images/products/cereal.png", stock: 55, unit: "box", description: "Crunchy cereal for quick breakfast." },
  { name: "Mushrooms", category: "Vegetables", price: 3.2, image: "/images/products/mushrooms.png", stock: 45, unit: "250 g", description: "Fresh mushrooms for soups, pasta, and stir-fries." },
  { name: "Green Beans", category: "Vegetables", price: 2.2, image: "/images/products/green-beans.png", stock: 65, unit: "500 g", description: "Tender green beans for sides and curries." },
  { name: "Peas", category: "Vegetables", price: 2.1, image: "/images/products/peas.png", stock: 70, unit: "500 g", description: "Sweet green peas for rice, curries, and soups." },
  { name: "Corn", category: "Vegetables", price: 2.0, image: "/images/products/corn.png", stock: 75, unit: "500 g", description: "Sweet corn kernels for snacks and sides." },
  { name: "Avocado", category: "Fruits", price: 2.8, image: "/images/products/avocado.png", stock: 50, unit: "piece", description: "Creamy avocado for toast, salads, and bowls." },
  { name: "Lemon", category: "Fruits", price: 1.5, image: "/images/products/lemon.png", stock: 85, unit: "500 g", description: "Fresh lemons for juice, marinades, and tea." },
  { name: "Lime", category: "Fruits", price: 1.4, image: "/images/products/lime.png", stock: 85, unit: "500 g", description: "Zesty limes for drinks, dressings, and seafood." },
  { name: "Mango", category: "Fruits", price: 3.6, image: "/images/products/mango.png", stock: 60, unit: "1 kg", description: "Sweet mangoes for desserts and smoothies." },
  { name: "Pineapple", category: "Fruits", price: 3.9, image: "/images/products/pineapple.png", stock: 35, unit: "piece", description: "Tropical pineapple for juices and fruit plates." },
  { name: "Watermelon", category: "Fruits", price: 4.2, image: "/images/products/watermelon.png", stock: 30, unit: "piece", description: "Refreshing watermelon for sharing and summer snacks." }
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Sample products seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedProducts();
}

module.exports = products;
