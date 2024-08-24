const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const {
    createUser,
    updateUser,
    archiveUser,
    getUser,
    getUsers
} = require('../controllers/userController')

// API 
router.get('/', verifyJWT, getUsers);

router.post('/create', createUser);

router.put('/update/:id', updateUser);

router.delete('/archive', archiveUser);

router.get('/:id', getUser);

module.exports = router;