const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization'); // Expecting token in the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Replace with your secret
        req.user.email = decoded; // Attach user info (email and role) to req.user
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;
