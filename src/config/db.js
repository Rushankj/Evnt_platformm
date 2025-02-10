const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Fix the database path to be correct relative to your project structure
const dbPath = path.resolve(__dirname, '../database/events.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    // Initialize tables with email field added
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        category TEXT,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Tables created successfully');
      }
    });
  }
});

module.exports = db;