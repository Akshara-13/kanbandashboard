
const express = require('express');
const router = express.Router();

const activityController = require('./activity.controller');

const {
    authenticateToken,
    authorizeTenant
} = require('../../middleware/auth.middleware');

router.use(
    '/:tenantId/:boardId',
    authenticateToken,
    authorizeTenant
);

// GET BOARD ACTIVITY
router.get(
    '/:tenantId/:boardId',
    activityController.getBoardActivity
);

// GET TASK ACTIVITY
router.get(
    '/:tenantId/:boardId/:taskId',
    activityController.getTaskActivity
);

module.exports = router;
