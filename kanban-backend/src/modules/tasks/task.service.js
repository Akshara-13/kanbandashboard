
const db = require('../../config/db');
const { getIO } = require('../../config/socket');

// Helper: run database operations in one transaction
const withTransaction = async (callback) => {
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Helper: insert activity record
const logActivity = async (
    client,
    tenantId,
    membershipId,
    boardId,
    taskId,
    action,
    details
) => {
    await client.query(
        `INSERT INTO activity_logs (
            tenant_id,
            actor_membership_id,
            board_id,
            task_id,
            action,
            details
        )
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
        [
            tenantId,
            membershipId,
            boardId,
            taskId,
            action,
            JSON.stringify(details)
        ]
    );
};

// Helper: broadcast real-time task events
const emitTaskEvent = (tenantId, boardId, event, task) => {
    try {
        const io = getIO();
        const room = `tenant:${tenantId}:board:${boardId}`;

        io.to(room).emit(event, {
            tenantId,
            boardId,
            task
        });
    } catch (error) {
        console.error('Socket event error:', error.message);
    }
};

// CREATE TASK
const createTask = async (
    tenantId, boardId, columnId, data, membershipId
) => {
    const {
        title, description, assigned_to, priority, position, due_date
    } = data;

    const task = await withTransaction(async (client) => {
        const result = await client.query(
            `INSERT INTO tasks (
                tenant_id, board_id, column_id, title,
                description, assigned_to, created_by,
                priority, position, due_date
            )
            SELECT $1, b.id, c.id, $4, $5, $6, $7, $8, $9, $10
            FROM boards b
            JOIN kanban_columns c
              ON c.board_id = b.id
             AND c.tenant_id = b.tenant_id
            WHERE b.id = $2
              AND b.tenant_id = $1
              AND c.id = $3
              AND (
                  $6::uuid IS NULL OR EXISTS (
                      SELECT 1 FROM memberships m
                      WHERE m.id = $6 AND m.tenant_id = $1
                  )
              )
            RETURNING *`,
            [
                tenantId, boardId, columnId, title,
                description || null, assigned_to || null,
                membershipId, priority || 'medium',
                position ?? 0, due_date || null
            ]
        );

        const createdTask = result.rows[0];

        if (!createdTask) return null;

        await logActivity(
            client, tenantId, membershipId, boardId,
            createdTask.id, 'TASK_CREATED',
            { title: createdTask.title }
        );

        return createdTask;
    });

    if (task) {
        emitTaskEvent(tenantId, boardId, 'task:created', task);
    }

    return task;
};

// GET ALL TASKS
const getTasks = async (tenantId, boardId) => {
    const result = await db.query(
        `SELECT * FROM tasks
         WHERE tenant_id = $1 AND board_id = $2
         ORDER BY column_id, position`,
        [tenantId, boardId]
    );

    return result.rows;
};

// GET ONE TASK
const getTaskById = async (tenantId, boardId, taskId) => {
    const result = await db.query(
        `SELECT * FROM tasks
         WHERE id = $1 AND tenant_id = $2 AND board_id = $3`,
        [taskId, tenantId, boardId]
    );

    return result.rows[0];
};

// UPDATE TASK WITH VERSION CHECK
const updateTask = async (
    tenantId, boardId, taskId, data, membershipId
) => {
    const {
        title, description, priority,
        assigned_to, due_date, position, version
    } = data;

    const task = await withTransaction(async (client) => {
        const result = await client.query(
            `UPDATE tasks
             SET title = CASE WHEN $5 THEN $6 ELSE title END,
                 description = CASE WHEN $7 THEN $8 ELSE description END,
                 priority = CASE WHEN $9 THEN $10 ELSE priority END,
                 assigned_to = CASE WHEN $11 THEN $12::uuid ELSE assigned_to END,
                 due_date = CASE WHEN $13 THEN $14::timestamptz ELSE due_date END,
                 position = CASE WHEN $15 THEN $16 ELSE position END,
                 version = version + 1,
                 updated_at = NOW()
             WHERE id = $1
               AND tenant_id = $2
               AND board_id = $3
               AND version = $4
               AND (
                   NOT $11 OR $12::uuid IS NULL OR EXISTS (
                       SELECT 1 FROM memberships m
                       WHERE m.id = $12::uuid
                         AND m.tenant_id = $2
                   )
               )
             RETURNING *`,
            [
                taskId, tenantId, boardId, version,
                title !== undefined, title,
                description !== undefined, description,
                priority !== undefined, priority,
                assigned_to !== undefined, assigned_to,
                due_date !== undefined, due_date,
                position !== undefined, position
            ]
        );

        const updatedTask = result.rows[0];

        if (!updatedTask) return null;

        await logActivity(
            client, tenantId, membershipId, boardId,
            updatedTask.id, 'TASK_UPDATED',
            {
                title: updatedTask.title,
                version: updatedTask.version
            }
        );

        return updatedTask;
    });

    if (task) {
        emitTaskEvent(tenantId, boardId, 'task:updated', task);
    }

    return task;
};

// MOVE TASK TO ANOTHER COLUMN
const moveTask = async (
    tenantId, boardId, taskId, columnId,
    position, version, membershipId
) => {
    const task = await withTransaction(async (client) => {
        const oldResult = await client.query(
            `SELECT * FROM tasks
             WHERE id = $1
               AND tenant_id = $2
               AND board_id = $3
               AND version = $4
             FOR UPDATE`,
            [taskId, tenantId, boardId, version]
        );

        const oldTask = oldResult.rows[0];

        if (!oldTask) return null;

        const result = await client.query(
            `UPDATE tasks t
             SET column_id = c.id,
                 position = $5,
                 version = t.version + 1,
                 updated_at = NOW()
             FROM kanban_columns c
             WHERE t.id = $1
               AND t.tenant_id = $2
               AND t.board_id = $3
               AND t.version = $6
               AND c.id = $4
               AND c.tenant_id = $2
               AND c.board_id = $3
             RETURNING t.*`,
            [taskId, tenantId, boardId, columnId, position, version]
        );

        const movedTask = result.rows[0];

        if (!movedTask) return null;

        await logActivity(
            client, tenantId, membershipId, boardId,
            movedTask.id, 'TASK_MOVED',
            {
                title: movedTask.title,
                from_column_id: oldTask.column_id,
                to_column_id: movedTask.column_id,
                position: movedTask.position
            }
        );

        return movedTask;
    });

    if (task) {
        emitTaskEvent(tenantId, boardId, 'task:moved', task);
    }

    return task;
};

// DELETE TASK
const deleteTask = async (
    tenantId, boardId, taskId, membershipId
) => {
    const task = await withTransaction(async (client) => {
        const result = await client.query(
            `SELECT * FROM tasks
             WHERE id = $1
               AND tenant_id = $2
               AND board_id = $3
             FOR UPDATE`,
            [taskId, tenantId, boardId]
        );

        const existingTask = result.rows[0];

        if (!existingTask) return null;

        const deleted = await client.query(
            `DELETE FROM tasks
             WHERE id = $1
               AND tenant_id = $2
               AND board_id = $3
             RETURNING id`,
            [taskId, tenantId, boardId]
        );

        if (!deleted.rows[0]) return null;

        await logActivity(
            client, tenantId, membershipId, boardId,
            null, 'TASK_DELETED',
            {
                deleted_task_id: existingTask.id,
                title: existingTask.title,
                column_id: existingTask.column_id
            }
        );

        return deleted.rows[0];
    });

    if (task) {
        emitTaskEvent(tenantId, boardId, 'task:deleted', task);
    }

    return task;
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    moveTask,
    deleteTask
};
