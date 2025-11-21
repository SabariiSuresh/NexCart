
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({ type: 'NO_TOKEN', message: 'No token provided' })
    }

    const parts = header.split(' ');
    const token = parts[1];

    if (!token) {
        return res.status(401).json({ type: 'INVALID_FORMAT', message: 'Invalid token format' })
    }

    try {

        const decode = jwt.verify(token, process.env.TOKEN);
        req.user = decode;
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ type: 'TOKEN_EXPIRED', message: 'Your session has expired. Please login again.' });
        } else {
            res.status(500).json({ type: 'INVALID_TOKEN', message: 'Invalid or expired token. Please login again.' })
        }
    }

}


module.exports = protect;