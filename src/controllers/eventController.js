const db = require("../config/db");

exports.getEvents = (req, res) => {
  const userId = req.user.userId; // ✅ Get logged-in user's ID from token

  db.all("SELECT * FROM events WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createEvent = (req, res) => {
  const userId = req.user.userId; // ✅ Get logged-in user's ID from token
  const { name, description, date } = req.body;

  if (!name || !description || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(
    "INSERT INTO events (user_id, name, description, date) VALUES (?, ?, ?, ?)",
    [userId, name, description, date],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Event created successfully!", event_id: this.lastID });
    }
  );
};
