const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const SECRET_KEY = 'your-secret-key-keep-it-safe';
const PORT = 3000;

const users = [
  {
    id: 1,
    username: 'testuser',
    password: 'password123'
  }
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'You have accessed a protected route!',
    user: {
      id: req.user.id,
      username: req.user.username,
      iat: req.user.iat,
      exp: req.user.exp
    }
  });
});

app.get('/public', (req, res) => {
  res.status(200).json({
    message: 'This is a public route, no authentication required!'
  });
});

app.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'User profile data',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: `${req.user.username}@example.com`,
      role: 'user'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\nAvailable routes:');
  console.log('POST   /login      - Login with credentials');
  console.log('GET    /public     - Public route (no auth required)');
  console.log('GET    /protected  - Protected route (auth required)');
  console.log('GET    /profile    - Protected route (auth required)');
  console.log('\nTest credentials:');
  console.log('username: testuser');
  console.log('password: password123');
});