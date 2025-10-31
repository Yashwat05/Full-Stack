const express = require('express');
const app = express();
const PORT = 3000;

// Middleware 1: Request Logger
// This middleware logs every incoming request with method, URL, and timestamp
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Middleware 2: Bearer Token Authentication
// This middleware checks for a valid Bearer token in the Authorization header
const bearerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing or incorrect"
    });
  }
  
  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: "Authorization header missing or incorrect"
    });
  }
  
  // Extract the token
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  // Validate the token
  if (token !== 'mysecrettoken') {
    return res.status(401).json({
      message: "Authorization header missing or incorrect"
    });
  }
  
  // Token is valid, proceed to the next middleware/route
  next();
};

// Apply logging middleware globally to all routes
app.use(requestLogger);

// Public route - no authentication required
app.get('/public', (req, res) => {
  res.status(200).json({
    message: "This is a public route. No authentication required."
  });
});

// Protected route - requires Bearer token authentication
app.get('/protected', bearerAuth, (req, res) => {
  res.status(200).json({
    message: "You have accessed a protected route with a valid Bearer token!"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`\nTest the routes using:`);
  console.log(`  Public:    curl http://localhost:${PORT}/public`);
  console.log(`  Protected: curl -H "Authorization: Bearer mysecrettoken" http://localhost:${PORT}/protected`);
});