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

    console.log("Token Received:", token); // Log the received token
    console.log("JWT Secret:", process.env.JWTPRIVATEKEY); // Log the secret for debugging

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Use your JWT secret
        req.user = decoded; // Attach decoded user info (email, role, etc.) to req.user
        console.log("Decoded User:", decoded); // Log decoded user information
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error("Token Verification Error:", error.message); // Log the error message
        res.status(400).json({ message: 'Invalid token.', error: error.message });
    }
};

module.exports = auth;
