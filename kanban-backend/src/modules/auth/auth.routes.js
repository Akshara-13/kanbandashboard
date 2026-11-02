const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const {
    authenticateToken,
    authorizeTenant,
    authorizeRole
} = require('../../middleware/auth.middleware');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Protected route
router.get('/me', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: req.user
    });
});

// Test tenant authorization
router.get(
    '/tenant/:tenantId/test',
    authenticateToken,
    authorizeTenant,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Tenant access granted',
            tenant: req.tenant,
            user: req.user
        });
    }
);

router.get(
    '/tenant/:tenantId/admin-test',
    authenticateToken,
    authorizeTenant,
    authorizeRole('owner', 'admin'),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Access granted: Owner/Admin permission verified',
            user: req.user,
            tenant: req.tenant
        });
    }
);

module.exports = router;

