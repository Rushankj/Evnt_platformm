const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;
  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    }
  );
};

// Register user
exports.register = async (req, res) => {
  const { username, password } = req.body;
  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function (err) {
      if (err) return res.status(400).json({ error: 'User already exists' });
      res.status(201).json({ message: 'User registered' });
    }
  );
};