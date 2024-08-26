const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        // console.log('cookiesss:',cookies)
        if (!cookies?.jwt) return res.sendStatus(401);
        // console.log('cookies.jwt', cookies.jwt)
        const refreshToken = cookies.jwt;

        const usersData = await fsPromises.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        const login = users.find(person => person.refreshToken === refreshToken);
        if (!login) return res.sendStatus(403);

        // Verify JWT
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                if (error || login.username !== decoded.username) return res.sendStatus(403);

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