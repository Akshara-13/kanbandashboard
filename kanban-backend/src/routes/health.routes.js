
const express = require("express");
const { testDatabaseConnection } = require("../config/db");

const router = express.Router();

// Check whether the backend is running
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Kanban API is running",
  });
});

// Check whether PostgreSQL is connected
router.get("/ready", async (req, res, next) => {
  try {
    await testDatabaseConnection();

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
