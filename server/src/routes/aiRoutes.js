const express = require("express");
const { generateRecipe } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-recipe", protect, generateRecipe);

module.exports = router;
