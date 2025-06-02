import jwt from 'jsonwebtoken';

export const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ state: "401", message: "Access denied. No token provided."});
    }

    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ state: "403", message: "Invalid token." });
    }
}