
const express = require('express');
const router = express.Router();

const taskController = require('./task.controller');

const {
    authenticateToken,
    authorizeTenant,
    authorizeRole
} = require('../../middleware/auth.middleware');

router.use('/:tenantId/:boardId', authenticateToken, authorizeTenant);

// CREATE TASK
router.post(
    '/:tenantId/:boardId',
    authorizeRole('owner', 'admin', 'member'),
    taskController.create
);

// GET ALL TASKS
router.get('/:tenantId/:boardId', taskController.getAll);

// GET ONE TASK
router.get('/:tenantId/:boardId/:taskId', taskController.getOne);

// UPDATE TASK
router.put(
    '/:tenantId/:boardId/:taskId',
    authorizeRole('owner', 'admin', 'member'),
    taskController.update
);

// MOVE TASK
router.patch(
    '/:tenantId/:boardId/:taskId/move',
    authorizeRole('owner', 'admin', 'member'),
    taskController.move
);

// DELETE TASK
router.delete(
    '/:tenantId/:boardId/:taskId',
    authorizeRole('owner', 'admin'),
    taskController.remove
);

module.exports = router;
