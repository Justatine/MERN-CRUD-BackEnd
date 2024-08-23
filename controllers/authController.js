const User = require('../models/userModel')

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const login = await User.findOne({ username, password });
        if (login) {
            res.status(200).json({ status: 'success', message: 'Login successful' })
        }else{
            res.status(200).json({ status: 'failed', message: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error logging user', error: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, idno, image, password, username } = req.body;
        const newUser  = await User.create({
            firstname: firstname,
            lastname: lastname,
            idno: idno,
            image: image,
            password: password,
            role: 'Student',
            username: username,
        });
        if (newUser) {
            res.status(200).json({ message: 'Registration successful', status: 'success' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error adding user', status: 'failed', error: error.message });
    }
}

module.exports = {
    loginUser,
    registerUser
}