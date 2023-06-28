var express = require('express');
var router = express.Router();
const User = require('../models/user'); 
const Recipe = require('../models/recipes')
// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Attach the decoded token payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.delete('/removeFromFavorites/:id', verifyToken, async function(req, res, next) {
  try {
    const recipeId = req.params.id;

    // Find the user by ID
    const user = await User.findById(req.user.user_id);

    // Check if the recipe ID exists in the user's favorites
    const existingIndex = user.favorites.indexOf(recipeId);
    if (existingIndex === -1) {
      return res.status(400).json({ error: 'Recipe does not exist in favorites' });
    }

    // Remove the recipe ID from the user's favorites
    user.favorites.splice(existingIndex, 1);

    // Save the updated user object
    await user.save();

    res.json({ message: 'Recipe removed from favorites successfully' });
    console.log('Recipe removed from favorites:', recipeId);
  } catch (error) {
    console.error("An error occurred while removing the recipe from favorites:", error);
    res.status(500).json({ error: "Failed to remove the recipe from favorites" });
  }
});

router.delete('/delete/:id', verifyToken, async function(req, res, next) {
  try {
    const recipeId = req.params.id;

    // Remove the recipe from the database
    await Recipe.findByIdAndDelete(recipeId);

    res.json({ message: 'Recipe deleted successfully' });
    console.log('Recipe deleted:', recipeId);
  } catch (error) {
    console.error("An error occurred while deleting the recipe:", error);
    res.status(500).json({ error: "Failed to delete the recipe" });
  }
});

module.exports = router;



module.exports = router;
