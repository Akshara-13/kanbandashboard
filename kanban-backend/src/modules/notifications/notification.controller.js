
const notificationService = require('./notification.service');

// GET NOTIFICATIONS
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getNotifications(
            req.tenant.id,
            req.user.userId
        );

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// MARK ONE AS READ
const markAsRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markAsRead(
            req.tenant.id,
            req.user.userId,
            req.params.notificationId
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

// MARK ALL AS READ
const markAllAsRead = async (req, res, next) => {
    try {
        const notifications = await notificationService.markAllAsRead(
            req.tenant.id,
            req.user.userId
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            count: notifications.length
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
