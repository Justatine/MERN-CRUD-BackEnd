const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const login = await User.findOne({ username, password });
        
        if (login) {
            // JWT Sign
            const accessToken = jwt.sign(
                { username: login.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            const refreshToken = jwt.sign(
                { username: login.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');
            let users = [];
            try {
                const usersData = await fsPromises.readFile(usersFilePath, 'utf-8');
                users = usersData ? JSON.parse(usersData) : []; 
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err; 
                }
            }
            // const usersData = await fsPromises.readFile(usersFilePath, 'utf-8');
            // const users = JSON.parse(usersData);

            const otherUsers = users.filter(user => user.username !== login.username);
            const currentUser = { ...login.toObject(), refreshToken };
            const updatedUsers = [...otherUsers, currentUser];

            await fsPromises.writeFile(usersFilePath, JSON.stringify(updatedUsers));

            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 100 });
            res.status(200).json({ userRole: login.role, status: 'success', message: 'Login successful',  accessToken: accessToken });
        } else {
            res.status(200).json({ status: 'failed', message: 'Login failed. Invalid username / password.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error logging user', error: error.message });
    }
};

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