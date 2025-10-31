const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample product data
const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Keyboard", price: 45 },
  { id: 4, name: "Monitor", price: 300 },
];

// API endpoint to get all products
app.get("/api/products", (req, res) => {
  // Simulate network delay
  setTimeout(() => {
    res.json({
      success: true,
      data: products,
    });
  }, 500);
});

// API endpoint to get a single product by ID
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json({
      success: true,
      data: product,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
