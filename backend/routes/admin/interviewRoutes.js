import express from "express";
import InterviewRequest from "../../models/InterviewRequest.js";
import { protect } from "../../middleware/authMiddleware.js";
import { adminAuth } from "../../middleware/adminAuth.js";

const router = express.Router();

// READ - Get scheduled live interviews for admin panel
router.get("/", protect, adminAuth, async (req, res) => {
  try {
    const status = req.query.status || "scheduled";

    const interviews = await InterviewRequest.find({ status })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching scheduled interviews",
      error: err.message,
    });
  }
});

export default router;
