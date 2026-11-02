
const express = require('express');
const router = express.Router();

const boardController = require('./board.controller');

const {
    authenticateToken,
    authorizeTenant,
    authorizeRole
} = require('../../middleware/auth.middleware');

router.use('/:tenantId', authenticateToken, authorizeTenant);

router.post(
    '/:tenantId',
    authorizeRole('owner', 'admin'),
    boardController.create
);

router.get('/:tenantId', boardController.getAll);

router.get('/:tenantId/:boardId', boardController.getOne);

router.put(
    '/:tenantId/:boardId',
    authorizeRole('owner', 'admin'),
    boardController.update
);

router.delete(
    '/:tenantId/:boardId',
    authorizeRole('owner'),
    boardController.remove
);

module.exports = router;
