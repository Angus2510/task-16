const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, { 
     dbName:"foodies",

      
    })
    .then(() => {
      console.log("Successfully connected to foodies database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};