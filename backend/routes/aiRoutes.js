import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { requestLiveInterview } from "../controllers/interviewController.js";
import {
  predictRole,
  digitalTwin,
  startInterview,
  finalEvaluate,
  atsScore,
} from "../controllers/aiController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Resume-based endpoints
router.post("/predict-role", predictRole);
router.post("/digital-twin", upload.single("resume"), digitalTwin);
router.post("/ats-score", upload.single("resume"), atsScore);
// AI Interview flow
router.post("/start", startInterview);
router.post("/final_evaluate",protect,finalEvaluate);

router.post(
  "/request-live-interview",
  protect,
  requestLiveInterview
);


export default router;
