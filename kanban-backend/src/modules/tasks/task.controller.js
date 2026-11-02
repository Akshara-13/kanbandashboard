

const taskService = require('./task.service');

const create = async (req, res, next) => {
    try {
        const { title, column_id, priority, position } = req.body;

        if (!title || typeof title !== 'string' || !title.trim() || !column_id) {
            return res.status(400).json({
                success: false,
                message: 'Title and column_id are required'
            });
        }

        const task = await taskService.createTask(
            req.tenant.id,
            req.params.boardId,
            column_id,
            { ...req.body, title: title.trim(), priority, position },
            req.tenant.membershipId
        );

        if (!task) {
            return res.status(400).json({
                success: false,
                message: 'Invalid board, column or assigned membership'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const tasks = await taskService.getTasks(
            req.tenant.id,
            req.params.boardId
        );

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(
            req.tenant.id,
            req.params.boardId,
            req.params.taskId
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        if (!Number.isInteger(req.body.version)) {
            return res.status(400).json({
                success: false,
                message: 'Current task version is required'
            });
        }

        const task = await taskService.updateTask(
            req.tenant.id,
            req.params.boardId,
            req.params.taskId,
            req.body,
            req.tenant.membershipId
        );

        if (!task) {
            return res.status(409).json({
                success: false,
                message: 'Task not found, invalid assignment, or version conflict. Refresh and try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

const move = async (req, res, next) => {
    try {
        const { column_id, position, version } = req.body;

        if (!column_id || !Number.isInteger(position) || !Number.isInteger(version)) {
            return res.status(400).json({
                success: false,
                message: 'column_id, position and version are required'
            });
        }

        const task = await taskService.moveTask(
            req.tenant.id,
            req.params.boardId,
            req.params.taskId,
            column_id,
            position,
            version,
            req.tenant.membershipId
        );

        if (!task) {
            return res.status(409).json({
                success: false,
                message: 'Task or target column not found, or version conflict'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task moved successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const task = await taskService.deleteTask(
            req.tenant.id,
            req.params.boardId,
            req.params.taskId,
            req.tenant.membershipId
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, getAll, getOne, update, move, remove };
