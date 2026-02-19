import mongoose from "mongoose";

const interviewRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  domain: String,
  experienceLevel: String,

  status: {
    type: String,
    enum: ["pending", "scheduled", "completed", "cancelled"],
    default: "pending"
  },

  meetingLink: String,

  scheduledAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model(
  "InterviewRequest",
  interviewRequestSchema
);
