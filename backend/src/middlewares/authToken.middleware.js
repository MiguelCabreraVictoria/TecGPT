import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const authToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ state: "401", message: "Access denied. No token provided."});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { userId: decoded.userId },
            select: {
                userId:true, 
                email: true,
                role: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ state: "401", message: "User not found." });
        }
        req.user = {
            userId: user.userId,
            email: user.email,
            role: user.role.name
        };
        next();
    } catch (error) {
        return res.status(403).json({ state: "403", message: "Invalid token." });
    }
}