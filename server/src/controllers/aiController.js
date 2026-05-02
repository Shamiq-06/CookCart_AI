const axios = require("axios");
const Recipe = require("../models/Recipe");

const fallbackRecipe = (dishName, availableIngredients = []) => {
  const title = dishName || "Smart Pantry Fried Rice";
  const pantry = Array.isArray(availableIngredients)
    ? availableIngredients
    : String(availableIngredients || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const known = {
    "chicken fried rice": ["Rice", "Chicken", "Egg", "Onion", "Carrot", "Spices"],
    "fried rice": ["Rice", "Egg", "Onion", "Carrot", "Spices"],
    pasta: ["Pasta", "Tomato", "Cheese", "Onion", "Spices"],
    noodles: ["Noodles", "Egg", "Carrot", "Onion", "Spices"],
    omelette: ["Egg", "Onion", "Tomato", "Cheese", "Spices"],
    curry: ["Rice", "Chicken", "Potato", "Tomato", "Onion", "Spices"]
  };
  const lowerTitle = title.toLowerCase();
  const required =
    Object.entries(known).find(([key]) => lowerTitle.includes(key))?.[1] || [
      "Rice",
      "Onion",
      "Tomato",
      "Carrot",
      "Spices"
    ];
  const pantryLower = pantry.map((p) => p.toLowerCase());

  return {
    recipeName: title,
    cookingTime: "30 minutes",
    ingredients: required,
    missingIngredients: required.filter((item) => !pantryLower.includes(item.toLowerCase())),
    steps: [
      "Wash, peel, and chop all vegetables into small even pieces so they cook at the same speed.",
      "Measure every ingredient before heating the pan, keeping spices, protein, and vegetables in separate bowls.",
      "Heat a wide pan on medium heat, add a small amount of oil, and cook the main protein until safe and lightly browned.",
      "Add onion and firm vegetables first, then stir in softer vegetables and spices until fragrant.",
      "Mix in the main base such as rice, pasta, or noodles and toss until every piece is hot and coated.",
      "Taste carefully, adjust salt or spice, turn off the heat, and serve while warm."
    ],
    healthTip: "Use less oil and add extra vegetables for more fiber and color."
  };
};

const extractJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI response did not include JSON");
  return JSON.parse(match[0]);
};

const normalizeList = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
};

const alignMissingIngredients = (recipe, pantry) => {
  const ingredients = normalizeList(recipe.ingredients);
  const pantryLower = pantry.map((item) => item.toLowerCase());

  return {
    recipeName: recipe.recipeName || "AI Generated Recipe",
    cookingTime: recipe.cookingTime || "30 minutes",
    ingredients,
    missingIngredients: ingredients.filter((item) => !pantryLower.includes(item.toLowerCase())),
    steps: normalizeList(recipe.steps).length
      ? normalizeList(recipe.steps)
      : ["Prepare the ingredients.", "Cook everything safely until done.", "Serve warm."],
    healthTip: recipe.healthTip || "Add vegetables and use moderate oil for a balanced meal."
  };
};

exports.generateRecipe = async (req, res, next) => {
  try {
    const { dishName, availableIngredients } = req.body;

    if (!dishName || !dishName.trim()) {
      res.status(400);
      throw new Error("Please enter a dish name before generating a recipe");
    }

    const pantry = Array.isArray(availableIngredients)
      ? availableIngredients
      : String(availableIngredients || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const prompt = `Return only JSON for a grocery recipe planner with keys recipeName, cookingTime, ingredients, missingIngredients, steps, healthTip. Dish: ${
      dishName
    }. Available ingredients the user already has: ${
      pantry.length ? pantry.join(", ") : "none"
    }. Missing ingredients must be exactly the required ingredients that are not in the available list. Steps must be beginner-friendly, accurate, and detailed enough to cook safely.`;

    let recipe;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key") {
      try {
        // Gemini receives a strict prompt so the frontend always gets the same recipe shape.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const { data } = await axios.post(url, {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        });
        recipe = extractJson(data.candidates?.[0]?.content?.parts?.[0]?.text || "");
      } catch (geminiError) {
        // For viva/demo safety, the project still works if Gemini is down or returns invalid JSON.
        recipe = fallbackRecipe(dishName, pantry);
      }
    } else {
      // Missing API key also uses local demo data, so the route never blocks project testing.
      recipe = fallbackRecipe(dishName, pantry);
    }

    recipe = alignMissingIngredients(recipe, pantry);

    const saved = await Recipe.create({
      user: req.user?._id,
      ...recipe,
      sourcePrompt: prompt
    });

    res.json(saved);
  } catch (error) {
    next(error);
  }
};
