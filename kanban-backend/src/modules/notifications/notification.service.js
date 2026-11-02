
const db = require('../../config/db');
const { getIO } = require('../../config/socket');

// CREATE NOTIFICATION
const createNotification = async (
    tenantId,
    userId,
    title,
    message,
    type,
    taskId = null,
    boardId = null
) => {
    const result = await db.query(
        `INSERT INTO notifications (
            tenant_id,
            user_id,
            title,
            message,
            type,
            related_task_id,
            related_board_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [tenantId, userId, title, message, type, taskId, boardId]
    );

    const notification = result.rows[0];

    // Send notification instantly to the user
    try {
        getIO()
            .to(`user:${userId}`)
            .emit('notification:new', notification);
    } catch (error) {
        console.error('Notification socket error:', error.message);
    }

    return notification;
};

// GET USER NOTIFICATIONS
const getNotifications = async (tenantId, userId) => {
    const result = await db.query(
        `SELECT *
         FROM notifications
         WHERE tenant_id = $1 AND user_id = $2
         ORDER BY created_at DESC`,
        [tenantId, userId]
    );

    return result.rows;
};

// MARK NOTIFICATION AS READ
const markAsRead = async (tenantId, userId, notificationId) => {
    const result = await db.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = $1
           AND tenant_id = $2
           AND user_id = $3
         RETURNING *`,
        [notificationId, tenantId, userId]
    );

    return result.rows[0];
};

// MARK ALL NOTIFICATIONS AS READ
const markAllAsRead = async (tenantId, userId) => {
    const result = await db.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE tenant_id = $1 AND user_id = $2
         RETURNING *`,
        [tenantId, userId]
    );

    return result.rows;
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
};
