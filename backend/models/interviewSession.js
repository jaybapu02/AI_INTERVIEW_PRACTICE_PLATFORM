// models/InterviewSession.js
import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  domain: String,
  averageScore: Number,
  finalFeedback: String,
  suggestions: [String],
  questions: [String],
  answers: [String],

  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("InterviewSession", interviewSessionSchema);