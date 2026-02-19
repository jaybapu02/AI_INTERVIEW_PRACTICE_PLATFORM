import InterviewRequest from "../models/InterviewRequest.js";

export const requestLiveInterview = async (req, res) => {
  try {
    const { domain, experienceLevel } = req.body;

    // Generate unique room name
    const roomName = `Interview_${req.user._id}_${Date.now()}`;

    const meetingLink = `https://meet.jit.si/${roomName}`;

    const request = await InterviewRequest.create({
      userId: req.user._id,
      domain,
      experienceLevel,
      meetingLink,
      status: "scheduled",
      scheduledAt: new Date()
    });

    res.json({
      message: "Interview scheduled",
      request
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
