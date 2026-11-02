
const express = require('express');
const router = express.Router();

const columnController = require('./column.controller');

const {
    authenticateToken,
    authorizeTenant,
    authorizeRole
} = require('../../middleware/auth.middleware');

router.use('/:tenantId/:boardId', authenticateToken, authorizeTenant);

router.post(
    '/:tenantId/:boardId',
    authorizeRole('owner', 'admin'),
    columnController.create
);

router.get('/:tenantId/:boardId', columnController.getAll);

router.get(
    '/:tenantId/:boardId/:columnId',
    columnController.getOne
);

router.put(
    '/:tenantId/:boardId/:columnId',
    authorizeRole('owner', 'admin'),
    columnController.update
);

router.delete(
    '/:tenantId/:boardId/:columnId',
    authorizeRole('owner', 'admin'),
    columnController.remove
);

module.exports = router;
