const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

// Path to the users.json file
const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
        const refreshToken = cookies.jwt;

        // Read the users from the JSON file
        const usersData = await fsPromises.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        const login = users.find(person => person.refreshToken === refreshToken);
        if (!login) return res.sendStatus(403); // Forbidden

        // Verify JWT
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                if (error || login.username !== decoded.username) return res.sendStatus(403);

                // Issue a new access token
                const accessToken = jwt.sign(
                    { username: decoded.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
                res.json({ accessToken });
            }
        );
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error handling refresh token', error: error.message });
    }
};

module.exports = {
    handleRefreshToken
};