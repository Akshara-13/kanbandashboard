
const db = require('../../config/db');

// CREATE COLUMN
const createColumn = async (tenantId, boardId, name, position) => {
    const result = await db.query(
        `INSERT INTO kanban_columns (tenant_id, board_id, name, position)
         SELECT $1, b.id, $3, $4
         FROM boards b
         WHERE b.id = $2 AND b.tenant_id = $1
         RETURNING *`,
        [tenantId, boardId, name, position]
    );

    return result.rows[0];
};

// GET ALL COLUMNS
const getColumns = async (tenantId, boardId) => {
    const result = await db.query(
        `SELECT * FROM kanban_columns
         WHERE tenant_id = $1 AND board_id = $2
         ORDER BY position ASC`,
        [tenantId, boardId]
    );

    return result.rows;
};

// GET ONE COLUMN
const getColumnById = async (tenantId, boardId, columnId) => {
    const result = await db.query(
        `SELECT * FROM kanban_columns
         WHERE id = $1
         AND tenant_id = $2
         AND board_id = $3`,
        [columnId, tenantId, boardId]
    );

    return result.rows[0];
};

// UPDATE COLUMN
const updateColumn = async (tenantId, boardId, columnId, name, position) => {
    const result = await db.query(
        `UPDATE kanban_columns
         SET name = COALESCE($4, name),
             position = COALESCE($5, position)
         WHERE id = $1
         AND tenant_id = $2
         AND board_id = $3
         RETURNING *`,
        [columnId, tenantId, boardId, name || null, position ?? null]
    );

    return result.rows[0];
};

// DELETE COLUMN
const deleteColumn = async (tenantId, boardId, columnId) => {
    const result = await db.query(
        `DELETE FROM kanban_columns
         WHERE id = $1
         AND tenant_id = $2
         AND board_id = $3
         RETURNING id`,
        [columnId, tenantId, boardId]
    );

    return result.rows[0];
};

module.exports = {
    createColumn,
    getColumns,
    getColumnById,
    updateColumn,
    deleteColumn
};
