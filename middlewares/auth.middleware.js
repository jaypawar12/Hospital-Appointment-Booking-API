const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ status: false, error: "Auth token is required." });
    }

    try {
        token = token.slice(7, token.length);

        const decoded = jwt.verify(token, process.env.Secret);
        req.user = decoded.current_user;

        next();
    } catch (error) {
        return res.status(403).json({ status: false, error: "Invalid or expired token." });
    }
};

module.exports = auth;
