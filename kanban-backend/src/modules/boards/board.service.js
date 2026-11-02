
const db = require('../../config/db');

// CREATE BOARD
const createBoard = async (tenantId, name, description, membershipId) => {
    const result = await db.query(
        `INSERT INTO boards (tenant_id, name, description, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [tenantId, name, description || null, membershipId]
    );

    return result.rows[0];
};

// GET ALL BOARDS
const getBoards = async (tenantId) => {
    const result = await db.query(
        `SELECT * FROM boards
         WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [tenantId]
    );

    return result.rows;
};

// GET ONE BOARD
const getBoardById = async (tenantId, boardId) => {
    const result = await db.query(
        `SELECT * FROM boards
         WHERE id = $1 AND tenant_id = $2`,
        [boardId, tenantId]
    );

    return result.rows[0];
};

// UPDATE BOARD
const updateBoard = async (tenantId, boardId, name, description) => {
    const result = await db.query(
        `UPDATE boards
         SET name = COALESCE($3, name),
             description = COALESCE($4, description),
             updated_at = NOW()
         WHERE id = $1 AND tenant_id = $2
         RETURNING *`,
        [boardId, tenantId, name || null, description || null]
    );

    return result.rows[0];
};

// DELETE BOARD
const deleteBoard = async (tenantId, boardId) => {
    const result = await db.query(
        `DELETE FROM boards
         WHERE id = $1 AND tenant_id = $2
         RETURNING id`,
        [boardId, tenantId]
    );

    return result.rows[0];
};

module.exports = {
    createBoard,
    getBoards,
    getBoardById,
    updateBoard,
    deleteBoard
};
