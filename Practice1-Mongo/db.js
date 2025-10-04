const mongoose = require("mongoose");

// Replace these with your Atlas credentials
const mongoURI = "mongodb+srv://yashwat:Punj%40676@practice1mongo.ux7a5nc.mongodb.net/productDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas!"))
    .catch(err => console.error("Connection error:", err));

module.exports = mongoose;
