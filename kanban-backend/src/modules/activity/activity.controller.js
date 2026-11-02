
const activityService = require('./activity.service');

const getBoardActivity = async (req, res, next) => {
    try {
        const activities = await activityService.getBoardActivity(
            req.tenant.id,
            req.params.boardId
        );

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (error) {
        next(error);
    }
};

const getTaskActivity = async (req, res, next) => {
    try {
        const activities = await activityService.getTaskActivity(
            req.tenant.id,
            req.params.boardId,
            req.params.taskId
        );

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBoardActivity,
    getTaskActivity
};
