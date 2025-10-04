const express = require("express");
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/studentRoutes");
const db = require("./db");

const app = express();
app.use(bodyParser.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Student Management System API!");
});

// Use student routes
app.use("/", studentRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
