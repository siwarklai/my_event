const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Expecting token in the Authorization header

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Split the 'Bearer' prefix from the token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Use your JWT secret
        req.user = decoded; // Attach decoded user info (email, role, etc.) to req.user
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;
