
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require('./modules/auth/auth.routes');
const env = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const boardRoutes = require('./modules/boards/board.routes');
const columnRoutes = require('./modules/columns/column.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const activityRoutes = require('./modules/activity/activity.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/notifications', notificationRoutes);
if (env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use('/api/auth', authRoutes);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.use("/api", healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
