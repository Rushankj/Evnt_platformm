const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // ✅ Attach user info to the request
        next(); // ✅ Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ error: "Invalid token. Authentication failed." });
    }
};

module.exports = authMiddleware;
