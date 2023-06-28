require("dotenv").config();
require("./config/usersDB").connect();
const axios = require("axios")
const helmet = require("helmet")
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const User = require("./models/user");
const Recipes = require('./models/recipes')
const auth = require("./middleware/auth");
const addRecipe = require("./routes/addRecipe")
const deleteRecipe =require("./routes/deleteRecipe")
const editRecipe = require("./routes/editRecipe")
const getRecipe = require("./routes/getRecipe")


const app = express();

app.use(express.json());
app.use(helmet())
app.use(cors())

app.use('/addRecipe', addRecipe)
app.use('/deleteRecipe', deleteRecipe)
app.use('/editRecipe', editRecipe)
app.use('/getRecipe', getRecipe)


app.post("/register", async (req, res) => {
  console.log("Test")
  try {
    console.log("Hi");
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }
    
    // Check if user already exists
    // Validate if user exists in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = new User({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const result = await user.save();
    console.log(result);

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    const data = {token: token, first_name: user.first_name}
    // Save user token
    user.token = token;

    // Return new user
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    
    // Validate if user exists in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
   
      const data = {token: token, first_name: user.first_name}
      

      // Return user
      return res.status(200).json(data);
    }

    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Check if the task exceeds 140 characters.
app.use((req, res, next) => {
  
  
  // Check if the request is of the JSON content type.
  if (req.headers["content-type"] !== "application/json") {
    return res.status(415).send("Unsupported media type");
  }
  
  // Move to the next middleware function.
  next();
});

// This should be the last route, else any route after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
