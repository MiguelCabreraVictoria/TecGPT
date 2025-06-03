import RoleType from "../common/enums/RoleType.enum";

export const authorizeRoles = (req, res, next) => {
    if (!req.user || req.user.role !== RoleType.ADMIN) {
        return res.status(403).json({
            state: "403",
            message: "Access denied. You do not have permission to perform this action."
        });
    }
    next();
};