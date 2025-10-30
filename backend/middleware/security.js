
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' })
    }

    try {

        const decode = jwt.verify(token, process.env.TOKEN);
        req.user = decode;
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your session has expired. Please login again.' });
        } else {
            res.status(500).json({ message: 'Invalid or expired token. Please login again.' })
        }
    }

}


module.exports = protect;