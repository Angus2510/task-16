var express = require('express');
var router = express.Router();
const User = require('../models/user'); 
const Recipe = require('../models/recipes');

// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      // Attach the decoded token payload to the request object
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};

router.post('/add', verifyToken, async function (req, res, next) {
  try {
    const { value } = req.body;
    console.log(value);

     const newRecipe = new Recipe({
      title: value.title,
      time: value.time,
      rating: value.rating,
      blurb: value.blurb,
      steps: value.steps,
      ingredients: value.ingredients,
      approved: value.approved,
      type: value.type,
    });
   
    // Save the updated recipe
    await newRecipe.save();

    // console.log(newRecipe);
    res.json(newRecipe);
    
  } catch (error) {
    console.error('An error occurred while adding the recipe:', error);
    res.status(500).json({ error: 'Failed to add the recipe' });
  }
});
router.put('/addToFavorites/:id', verifyToken, async function(req, res, next) {
  try {
    const recipeId = req.params.id;

    // Find the user by ID
    const user = await User.findById(req.user.user_id);

    // Check if the recipe ID already exists in the user's favorites
    const existingIndex = user.favorites.indexOf(recipeId);
    if (existingIndex !== -1) {
      return res.status(400).json({ error: 'Recipe already exists in favorites' });
    }

    // Add the recipe ID to the user's favorites
    user.favorites.push(recipeId);

    // Save the updated user object
    await user.save();

    res.json({ message: 'Recipe added to favorites successfully' });
    console.log('Recipe added to favorites:', recipeId);
  } catch (error) {
    console.error("An error occurred while adding the recipe to favorites:", error);
    res.status(500).json({ error: "Failed to add the recipe to favorites" });
  }
});

module.exports = router;
