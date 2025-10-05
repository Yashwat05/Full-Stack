
db.products.insertMany([
    {
      name: "T-Shirt",
      price: 599,
      category: "Clothing",
      variants: [
        { color: "Red", size: "M", stock: 50 },
        { color: "Blue", size: "L", stock: 20 }
      ]
    },
    {
      name: "Running Shoes",
      price: 2499,
      category: "Footwear",
      variants: [
        { color: "Black", size: "9", stock: 15 },
        { color: "White", size: "8", stock: 10 }
      ]
    },
    {
      name: "Smart Watch",
      price: 4999,
      category: "Electronics",
      variants: [
        { color: "Black", size: "Standard", stock: 25 },
        { color: "Silver", size: "Standard", stock: 5 }
      ]
    }
  ])
  
  db.products.find().pretty()
  
  db.products.find({ category: "Clothing" }).pretty()
  
  
  db.products.find({}, { name: 1, variants: 1, _id: 0 }).pretty()
  
  
  db.products.find({ "variants.stock": { $lt: 10 } }).pretty()
  