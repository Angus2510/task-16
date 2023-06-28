const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.put('/updateOne/:recipeId', verifyToken, async function (req, res, next) {
  try {
    const { recipeId } = req.params;
    const { value } = req.body;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    recipe.title = value.title;
    recipe.time = value.time;
    recipe.rating = value.rating;
    recipe.blurb = value.blurb;
    recipe.steps = value.steps;
    recipe.ingredients = value.ingredients;
    recipe.type = value.type;

    await recipe.save();

    res.json(recipe);
    console.log(`Recipe ${recipeId} updated`);
  } catch (error) {
    console.error('An error occurred while updating the recipe:', error);
    res.status(500).json({ error: 'Failed to update the recipe' });
  }
});

module.exports = router;
