const express = require("express");
const router = express.Router();

const {
    createUser,
    updateUser,
    archiveUser,
    loginUser,
    getUser,
    getUsers
} = require('../controllers/userController')

// API 
router.get('/', getUsers);

router.post('/create', createUser);

router.put('/update/:id', updateUser);

router.delete('/archive', archiveUser);

router.post('/login', loginUser);

router.get('/:id', getUser);

module.exports = router;