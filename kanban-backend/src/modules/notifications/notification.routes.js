
const express = require('express');
const router = express.Router();

const notificationController = require('./notification.controller');

const {
    authenticateToken,
    authorizeTenant
} = require('../../middleware/auth.middleware');

router.use('/:tenantId', authenticateToken, authorizeTenant);

// GET USER NOTIFICATIONS
router.get('/:tenantId', notificationController.getNotifications);

// MARK ONE AS READ
router.patch(
    '/:tenantId/:notificationId/read',
    notificationController.markAsRead
);

// MARK ALL AS READ
router.patch(
    '/:tenantId/read-all',
    notificationController.markAllAsRead
);

module.exports = router;
