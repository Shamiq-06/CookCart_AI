const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipeName: { type: String, required: true },
    cookingTime: { type: String, required: true },
    ingredients: [{ type: String }],
    missingIngredients: [{ type: String }],
    steps: [{ type: String }],
    healthTip: { type: String, default: "" },
    sourcePrompt: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
