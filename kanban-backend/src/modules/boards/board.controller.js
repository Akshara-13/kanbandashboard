
const boardService = require('./board.service');

const create = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Board name is required'
            });
        }

        const board = await boardService.createBoard(
            req.tenant.id,
            name.trim(),
            description,
            req.tenant.membershipId
        );

        res.status(201).json({
            success: true,
            message: 'Board created successfully',
            data: board
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const boards = await boardService.getBoards(req.tenant.id);

        res.status(200).json({
            success: true,
            data: boards
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const board = await boardService.getBoardById(
            req.tenant.id,
            req.params.boardId
        );

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Board not found'
            });
        }

        res.status(200).json({
            success: true,
            data: board
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const board = await boardService.updateBoard(
            req.tenant.id,
            req.params.boardId,
            name,
            description
        );

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Board not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Board updated successfully',
            data: board
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const board = await boardService.deleteBoard(
            req.tenant.id,
            req.params.boardId
        );

        if (!board) {
            return res.status(404).json({
                success: false,
                message: 'Board not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Board deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, getAll, getOne, update, remove };
