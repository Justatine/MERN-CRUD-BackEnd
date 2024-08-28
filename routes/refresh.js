const express = require("express");
const router = express.Router();

const {
    handleRefreshToken
} = require('../controllers/refreshTokenController')

// API
router.post('/', handleRefreshToken);

module.exports = router;