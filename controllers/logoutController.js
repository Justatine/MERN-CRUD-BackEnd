const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');

const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); 

        const refreshToken = cookies.jwt;

        const usersData = await fsPromises.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        const login = users.find(person => person.refreshToken === refreshToken);
        if (!login) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204); 
        }

        const otherUsers = users.filter(person => person.refreshToken !== refreshToken);
        const currentUser = { ...login, refreshToken: '' };
        const updatedUsers = [...otherUsers, currentUser];

        await fsPromises.writeFile(usersFilePath, JSON.stringify(updatedUsers, null, 2));

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204); 
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error logging out', error: error.message });
    }
};

module.exports = {
    handleLogout
};