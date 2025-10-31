const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

app.use(express.json());

// Mock database for users
const users = [
  {
    id: 1,
    username: 'adminUser',
    password: '$2a$10$X8qJ9Z3YvN3fY5Q2fY5Q2eY5Q2fY5Q2fY5Q2fY5Q2fY5Q2fY5Q2fY',
    role: 'Admin'
  },
  {
    id: 2,
    username: 'moderatorUser',
    password: '$2a$10$X8qJ9Z3YvN3fY5Q2fY5Q2eY5Q2fY5Q2fY5Q2fY5Q2fY5Q2fY5Q2fY',
    role: 'Moderator'
  },
  {
    id: 3,
    username: 'regularUser',
    password: '$2a$10$X8qJ9Z3YvN3fY5Q2fY5Q2eY5Q2fY5Q2fY5Q2fY5Q2fY5Q2fY5Q2fY',
    role: 'User'
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check user roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied: insufficient role',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// POST /login - Authentication endpoint
app.post('/login', async (req, res) => {
  const { id, username, password } = req.body;

  if (!id || !username || !password) {
    return res.status(400).json({ message: 'ID, username, and password are required' });
  }

  // Find user by ID and username
  const user = users.find(u => u.id === id && u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // For demo purposes, accept 'admin123' as password for all users
  // In production, use bcrypt.compare(password, user.password)
  const validPassword = password === 'admin123';

  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token with user data
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({ token });
});

// GET /admin-dashboard - Admin only route
app.get('/admin-dashboard', authenticateToken, authorizeRoles('Admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Admin dashboard',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      iat: req.user.iat,
      exp: req.user.exp
    }
  });
});

// GET /moderator-panel - Moderator and Admin route
app.get('/moderator-panel', authenticateToken, authorizeRoles('Moderator', 'Admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Moderator panel',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      iat: req.user.iat,
      exp: req.user.exp
    }
  });
});

// GET /user-profile - Accessible by all authenticated users
app.get('/user-profile', authenticateToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to your profile, ${req.user.username}`,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      iat: req.user.iat,
      exp: req.user.exp
    }
  });
});

// GET /user-management - Admin only
app.get('/user-management', authenticateToken, authorizeRoles('Admin'), (req, res) => {
  const usersList = users.map(user => ({
    id: user.id,
    username: user.username,
    role: user.role
  }));

  res.status(200).json({
    message: 'User management dashboard',
    users: usersList
  });
});

// GET /content-moderation - Moderator and Admin only
app.get('/content-moderation', authenticateToken, authorizeRoles('Moderator', 'Admin'), (req, res) => {
  res.status(200).json({
    message: 'Content moderation interface',
    moderator: req.user.username,
    role: req.user.role,
    permissions: ['view_content', 'edit_content', 'delete_content']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nAvailable users for testing:');
  console.log('1. Admin: { id: 1, username: "adminUser", password: "admin123", role: "Admin" }');
  console.log('2. Moderator: { id: 2, username: "moderatorUser", password: "admin123", role: "Moderator" }');
  console.log('3. User: { id: 3, username: "regularUser", password: "admin123", role: "User" }');
});