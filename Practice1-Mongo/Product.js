const mongoose = require("./db");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
