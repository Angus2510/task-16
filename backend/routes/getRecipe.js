var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user'); 
const Recipe = require('../models/recipes');

// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY); 
    // Attach the decoded token payload to the request object
    req.user = decoded;
    //console.log(decoded);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/get', verifyToken, async function(req, res, next) {
  try {
    // Find user by ID
    const user = await User.findById(req.user.user_id);

    // Get favorite recipe IDs from the user schema
    const favoriteRecipeIds = user.favorites;

    // Find favorite recipes using the recipe IDs
    const recipes = await Recipe.find({ _id: { $in: favoriteRecipeIds } });

    res.json({ favorites: recipes });
  } catch (error) {
    console.error('An error occurred while fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});


router.get('/getAll', verifyToken, async function(req, res, next) {
  try {
    const recipes = await Recipe.find();
    // console.log(recipes);
    
    res.json({recipes: recipes});
  } catch (error) {
    console.error('An error occurred while fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

module.exports = router;
