const express = require("express");
const { register, login } = require("../controllers/authController");
const authController = require('../controllers/authController');
const router = express.Router();


router.post("/register", register);
router.post("/login", authController.login);

module.exports = router;
