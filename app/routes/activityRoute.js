import exp from "express";
import ActivityModel from "../models/Activity.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const activityRouter = exp.Router();

// CREATE ACTIVITY
activityRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { action, cardId, listId } = req.body;

    const activity = new ActivityModel({
      userId: req.user.userID, // ✅ FIXED
      action,
      cardId,
      listId
    });

    await activity.save();

    res.json({
      message: "Activity logged",
      payload: activity
    });

  } catch (err) {
    res.status(500).json({ message: "Error logging activity" });
  }
});

// GET ACTIVITY BY CARD (BEST PRACTICE)
activityRouter.get("/card/:cardId", authMiddleware, async (req, res) => {
  try {
    const { cardId } = req.params;

    const activities = await ActivityModel
      .find({ cardId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({
      message: "Activity fetched",
      payload: activities
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching activity" });
  }
});

// ✅ GET ACTIVITY BY BOARD
activityRouter.get("/:boardId", authMiddleware, async (req, res) => {
  try {
    const { boardId } = req.params;

    const activities = await ActivityModel
      .find({ boardId }) // 🔥 IMPORTANT
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({
      message: "Activity fetched",
      payload: activities
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching activity" });
  }
});

export default activityRouter;