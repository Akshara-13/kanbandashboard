
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 1. AUTHENTICATION
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Token is required.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.userId || !decoded.email) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload'
            });
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// 2. TENANT AUTHORIZATION
const authorizeTenant = async (req, res, next) => {
    try {
        const tenantId = req.params.tenantId;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID is required'
            });
        }

        const result = await db.query(
            `SELECT
                m.id AS membership_id,
                m.role,
                m.tenant_id
             FROM memberships m
             JOIN users u
               ON u.id = m.user_id
             JOIN tenants t
               ON t.id = m.tenant_id
             WHERE m.tenant_id = $1
               AND m.user_id = $2
               AND u.is_active = TRUE
               `,
            [tenantId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You do not belong to this tenant'
            });
        }

        req.tenant = {
            id: result.rows[0].tenant_id,
            membershipId: result.rows[0].membership_id,
            role: result.rows[0].role
        };

        next();

    } catch (error) {
        next(error);
    }
};

// 3. ROLE-BASED ACCESS CONTROL
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.tenant || !req.tenant.role) {
            return res.status(403).json({
                success: false,
                message: 'Tenant authorization is required'
            });
        }

        if (!allowedRoles.includes(req.tenant.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission for this action'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeTenant,
    authorizeRole
};
