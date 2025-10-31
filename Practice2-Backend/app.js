const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Secret key for JWT signing (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Hardcoded user credentials (in production, use database with hashed passwords)
const USERS = {
  user1: 'password123'
};

// In-memory account balances (in production, use database)
const accounts = {
  user1: 1000
};

// Login endpoint - generates JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required' 
    });
  }

  // Verify credentials
  if (USERS[username] && USERS[username] === password) {
    // Generate JWT token with 1 hour expiration
    const token = jwt.sign(
      { username }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  }

  // Invalid credentials
  return res.status(401).json({ 
    message: 'Invalid username or password' 
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      message: 'Access token is required' 
    });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        message: 'Invalid or expired token' 
      });
    }

    // Attach user info to request object
    req.user = decoded;
    next();
  });
};

// Protected route - Get account balance
app.get('/balance', authenticateToken, (req, res) => {
  const { username } = req.user;
  const balance = accounts[username] || 0;

  res.status(200).json({ balance });
});

// Protected route - Deposit money
app.post('/deposit', authenticateToken, (req, res) => {
  const { username } = req.user;
  const { amount } = req.body;

  // Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ 
      message: 'Invalid deposit amount' 
    });
  }

  // Initialize account if doesn't exist
  if (!accounts[username]) {
    accounts[username] = 0;
  }

  // Add deposit to balance
  accounts[username] += amount;

  res.status(200).json({ 
    message: `Deposited $${amount}`,
    newBalance: accounts[username]
  });
});

// Protected route - Withdraw money
app.post('/withdraw', authenticateToken, (req, res) => {
  const { username } = req.user;
  const { amount } = req.body;

  // Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ 
      message: 'Invalid withdrawal amount' 
    });
  }

  // Check if account exists
  if (!accounts[username]) {
    return res.status(400).json({ 
      message: 'Account not found' 
    });
  }

  // Check sufficient balance
  if (accounts[username] < amount) {
    return res.status(400).json({ 
      message: 'Insufficient balance' 
    });
  }

  // Deduct withdrawal from balance
  accounts[username] -= amount;

  res.status(200).json({ 
    message: `Withdrew $${amount}`,
    newBalance: accounts[username]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error' 
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Banking API server running on http://localhost:${PORT}`);
  console.log('\nTest credentials:');
  console.log('Username: user1');
  console.log('Password: password123');
  console.log('\nEndpoints:');
  console.log('POST /login - Get JWT token');
  console.log('GET /balance - View account balance (protected)');
  console.log('POST /deposit - Deposit money (protected)');
  console.log('POST /withdraw - Withdraw money (protected)');
});