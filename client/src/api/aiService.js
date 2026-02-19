import axiosInstance from "./axiosInstance";

export const predictRole = (resume_text) => 
  axiosInstance.post("/ai/predict-role", { resume_text });

export const uploadResume = (formData) =>
  axiosInstance.post("/ai/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


// Send resume (formData) to ATS score endpoint. Pass `token` to include Authorization header when needed.
export const getAtsScore = (formData, token) =>
  axiosInstance.post("/ai/ats-score", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

export const getDigitalTwin = (formData, token) =>
  axiosInstance.post("/ai/digital-twin", formData, {
    headers: {  
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

// ===============================
// START INTERVIEW
// ===============================
export const startInterview = (domain, token) =>
  axiosInstance.post(
    "ai/start",
    { domain },
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );


// ===============================
// FINAL EVALUATION (NEW)
// ===============================
export const finalEvaluateInterview = (
  questions,
  answers,
  state,
  duration,
  token
) =>
  axiosInstance.post(
    "/ai/final_evaluate",
    {
      questions,
      answers,
      state,
      duration
    },
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );

export const dashboardStats = (token) =>
  axiosInstance.get("/dashboard/stats", {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });