
const db = require('../../config/db');

// GET BOARD ACTIVITY
const getBoardActivity = async (tenantId, boardId) => {
    const result = await db.query(
        `SELECT
            a.*,
            u.name AS actor_name
         FROM activity_logs a
         JOIN memberships m
           ON m.id = a.actor_membership_id
         JOIN users u
           ON u.id = m.user_id
         WHERE a.tenant_id = $1
           AND a.board_id = $2
         ORDER BY a.created_at DESC`,
        [tenantId, boardId]
    );

    return result.rows;
};

// GET TASK ACTIVITY
const getTaskActivity = async (tenantId, boardId, taskId) => {
    const result = await db.query(
        `SELECT
            a.*,
            u.name AS actor_name
         FROM activity_logs a
         JOIN memberships m
           ON m.id = a.actor_membership_id
         JOIN users u
           ON u.id = m.user_id
         WHERE a.tenant_id = $1
           AND a.board_id = $2
           AND (
               a.task_id = $3
               OR a.details->>'deleted_task_id' = $3::text
           )
         ORDER BY a.created_at DESC`,
        [tenantId, boardId, taskId]
    );

    return result.rows;
};

module.exports = {
    getBoardActivity,
    getTaskActivity
};
