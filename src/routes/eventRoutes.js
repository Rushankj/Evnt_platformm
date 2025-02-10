const express = require("express");
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import authentication middleware

const router = express.Router();

// ✅ Get events (Only authenticated users)
router.get("/", authMiddleware, eventController.getEvents);

// ✅ Create event (Only authenticated users)
router.post("/", authMiddleware, eventController.createEvent);

module.exports = router;
