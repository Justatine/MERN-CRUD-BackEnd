const express = require("express");
const router = express.Router();

const {
    handleLogout
} = require('../controllers/logoutController')

// API
router.get('/', handleLogout);

module.exports = router;