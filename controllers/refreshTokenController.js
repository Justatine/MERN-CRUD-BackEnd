const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'models', 'users.json');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        console.log('Cookies fetched:', cookies);
        
        if (!cookies?.jwt) {
            return res.sendStatus(401);
        }
        
        const refreshToken = cookies.jwt;
        console.log('Received refresh token:', refreshToken);

        const usersData = await fsPromises.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        const user = users.find(person => person.refreshToken === refreshToken);
        if (!user) {
            return res.sendStatus(403); 
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {

            if (error || user.username !== decoded.username) {
                return res.sendStatus(403); 
            }

            const accessToken = jwt.sign(
                { username: decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            console.log('New accessToken:', accessToken);
            res.json({ accessToken }); 
        });
    } catch (error) {
        res.status(500).json({ status: 'failed', message: 'Error handling refresh token', error: error.message });
    }
};

module.exports = {
    handleRefreshToken
};
