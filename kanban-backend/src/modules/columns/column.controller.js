
const columnService = require('./column.service');

const create = async (req, res, next) => {
    try {
        const { name, position } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Column name is required'
            });
        }

        const column = await columnService.createColumn(
            req.tenant.id,
            req.params.boardId,
            name.trim(),
            position ?? 0
        );

        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Board not found in this tenant'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Column created successfully',
            data: column
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const columns = await columnService.getColumns(
            req.tenant.id,
            req.params.boardId
        );

        res.status(200).json({
            success: true,
            data: columns
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const column = await columnService.getColumnById(
            req.tenant.id,
            req.params.boardId,
            req.params.columnId
        );

        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Column not found'
            });
        }

        res.status(200).json({
            success: true,
            data: column
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { name, position } = req.body;

        if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Column name must be a non-empty string'
            });
        }

        const column = await columnService.updateColumn(
            req.tenant.id,
            req.params.boardId,
            req.params.columnId,
            name?.trim(),
            position
        );

        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Column not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Column updated successfully',
            data: column
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const column = await columnService.deleteColumn(
            req.tenant.id,
            req.params.boardId,
            req.params.columnId
        );

        if (!column) {
            return res.status(404).json({
                success: false,
                message: 'Column not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Column deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, getAll, getOne, update, remove };
