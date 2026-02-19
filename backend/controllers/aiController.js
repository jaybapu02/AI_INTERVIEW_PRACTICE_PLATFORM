import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import InterviewSession from "../models/interviewSession.js";
import mockQuestions from "../data/mockQuestions.js";
import mockEvaluation from "../data/mockEvaluation.js";

const FLASK_URL = process.env.FLASK_API_URL || "http://127.0.0.1:5000";

// =======================================
// 🎯 Helper: Get Mock Questions by Domain
// =======================================
const getMockQuestionsForDomain = (domain) => {
  const domain_lower = domain.toLowerCase();
  
  // Try exact match first
  if (domain_lower in mockQuestions) {
    return mockQuestions[domain_lower];
  }
  
  // Try to find partial match
  for (const key in mockQuestions) {
    if (key.includes(domain_lower) || domain_lower.includes(key)) {
      return mockQuestions[key];
    }
  }
  
  // Default to general
  return mockQuestions.general || mockQuestions.python;
};

// =======================================
// 🎯 1️⃣ Predict Role
// =======================================
export const predictRole = async (req, res) => {
  try {
    const { resume_text } = req.body;
    if (!resume_text)
      return res.status(400).json({ message: "resume_text required" });

    const resp = await axios.post(`${FLASK_URL}/predict_role`, { resume_text });
    res.json(resp.data);
  } catch (err) {
    console.error("predictRole error:", err.message);
    res
      .status(500)
      .json({ message: "AI service error", error: err.message || err });
  }
};

// =======================================
// 🧬 2️⃣ Digital Twin (Resume Upload)
// =======================================
export const digitalTwin = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No resume file uploaded" });

    const formData = new FormData();
    formData.append("resume", fs.createReadStream(req.file.path));

    const resp = await axios.post(`${FLASK_URL}/digital_twin`, formData, {
      headers: formData.getHeaders(),
    });

    res.json(resp.data);
  } catch (err) {
    console.error("digitalTwin error:", err.message);
    res
      .status(500)
      .json({ message: "AI service error", error: err.message || err });
  }
};



export const atsScore = async (req, res) => {
  try {
    // 🔹 Validate resume file
    if (!req.file) {
      return res.status(400).json({
        message: "No resume file uploaded",
      });
    }

    // 🔹 Prepare form-data for Flask service
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(req.file.path));

    // 🔹 Call Flask ATS AI endpoint
    const response = await axios.post(
      `${FLASK_URL}/ats_score`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // 🔹 Send ATS result back to client
    return res.status(200).json(response.data);

  } catch (err) {
    console.error("atsScore controller error:", err.message);

    return res.status(500).json({
      message: "ATS AI service error",
      error: err.message || err,
    });
  }
};

// =======================================
// 🤖 3️⃣ AI Interview Flow
// =======================================
export const startInterview = async (req, res) => {
  try {
    const { domain } = req.body;

    try {
      // Try Flask service first
      const resp = await axios.post(
        `${FLASK_URL}/start_interview`,
        { domain },
        { timeout: 30000 } // 30 second timeout for Gemini API
      );

      res.json(resp.data);

    } catch (flaskError) {
      // ⚠️ FALLBACK TO MOCK DATA
      console.warn(`⚠️ Flask unavailable for domain "${domain}" - Using mock data:`, flaskError.message);
      
      const q_data = getMockQuestionsForDomain(domain);
      
      const questions = [
        "Please introduce yourself briefly (education, skills, projects)."
      ];
      
      // Add 3 technical + 2 coding + 2 behavioral questions
      questions.push(...(q_data.technical || []).slice(0, 3));
      questions.push(...(q_data.coding || []).slice(0, 2));
      questions.push(...(q_data.behavioral || []).slice(0, 2));

      res.json({
        questions: questions,
        state: {
          domain: domain,
          total_questions: questions.length,
          using_mock_data: true
        }
      });
    }

  } catch (err) {
    console.error("startInterview error:", err.message);
    res.status(500).json({
      message: "AI service error",
      error: err.message
    });
  }
};

// export const finalEvaluate = async (req, res) => {
//   try {
//     const { answers, questions, state, duration } = req.body;

//     if (!answers || !questions)
//       return res.status(400).json({
//         message: "answers and questions required"
//       });

//     let data;

//     try {
//       // Try Flask service first
//       const resp = await axios.post(
//         `${FLASK_URL}/final_evaluate`,
//         { answers, questions, state },
//         { timeout: 30000 } // 30 second timeout for Gemini API
//       );

//       data = resp.data;

//     } catch (flaskError) {

//       // ⚠️ FALLBACK TO MOCK EVALUATION
//       console.warn(`⚠️ Flask evaluation unavailable - Using mock evaluation:`, flaskError.message);
//       const validAnswers = answers.filter(
//     (a) =>
//       a &&
//       a.trim() &&
//       a.trim().toLowerCase() !== "no answer submitted."
//   );

//   const answerRatio = validAnswers.length / questions.length;

//   let fallbackScore;

//   // Realistic scoring logic
//   if (answerRatio === 0) {
//     fallbackScore = 1.5; // no effort
//   } else if (answerRatio < 0.4) {
//     fallbackScore = 3.5; // mostly skipped
//   } else if (answerRatio < 0.7) {
//     fallbackScore = 5.5; // average effort
//   } else {
//     fallbackScore = parseFloat(
//       (Math.random() * 2 + 6).toFixed(1)
//     ); // good attempt (6–8)
//   }

      
//       data = {
//         average_score: fallbackScore,
//         strengths: mockEvaluation.strengths,
//         improvements: mockEvaluation.improvements,
//         final_feedback: mockEvaluation.final_feedback,
//         suggestions: Array.isArray(mockEvaluation.suggestions) 
//           ? mockEvaluation.suggestions 
//           : [mockEvaluation.suggestions],
//         using_mock_data: true
//       };
//     }

//     // 🔥 SAVE INTERVIEW RESULT
//     let suggestionsArray = [];
//     if (Array.isArray(data.suggestions)) {
//       suggestionsArray = data.suggestions;
//     } else if (typeof data.suggestions === 'string' && data.suggestions.length > 0) {
//       // Split if comma-separated
//       suggestionsArray = data.suggestions.split(',').map(s => s.trim()).filter(s => s.length > 0);
//     }
    
//     await InterviewSession.create({
//       userId: req.user._id,
//       domain: state.domain,
//       averageScore: data.average_score,
//       finalFeedback: data.final_feedback,
//       suggestions: suggestionsArray,
//       duration: duration || 0
//     });

//     // Convert suggestions array to proper markdown format for React Markdown
//     const suggestionsMarkdown = suggestionsArray.length > 0
//       ? suggestionsArray.map(s => `- ${String(s).trim()}`).join('\n')
//       : "- Continue practicing and improving";

//     res.json({
//     average_score: data.average_score,
//     strengths: String(data.strengths || "Good performance overall"),
//     improvements: String(data.improvements || "Continue practicing and learning"),
//     final_feedback: String(data.final_feedback || "Great effort! Keep improving."),
//     suggestions: suggestionsArray,
//     using_mock_data: data.using_mock_data || false
//   });




//   } catch (err) {
//     console.error("finalEvaluate error:", err.message);
//     res.status(500).json({
//       message: "AI service error",
//       error: err.message
//     });
//   }
// };

export const finalEvaluate = async (req, res) => {
  try {
    const { answers, questions, state, duration } = req.body;

    if (!answers || !questions) {
      return res.status(400).json({
        message: "answers and questions required"
      });
    }

    let data;

    try {
      // 🔥 Try Flask service first
      const resp = await axios.post(
        `${FLASK_URL}/final_evaluate`,
        { answers, questions, state },
        { timeout: 30000 }
      );

      data = resp.data;

      // ⭐ IMPORTANT: Override score if no answers
      const validAnswers = answers.filter(
        (a) => typeof a === "string" && a.trim().length > 0
      );

      if (validAnswers.length === 0) {
        data.average_score = 1.5;
        data.final_feedback =
          "No answers were provided during the interview.";
      }

    } catch (flaskError) {
      // ⚠️ FALLBACK TO MOCK EVALUATION
      console.warn(
        "⚠️ Flask evaluation unavailable - Using mock evaluation:",
        flaskError.message
      );

      const validAnswers = answers.filter(
        (a) =>
          typeof a === "string" &&
          a.trim().length > 0 &&
          a.trim().toLowerCase() !== "no answer submitted."
      );

      const totalQuestions = questions.length || 1;
      const answerRatio = validAnswers.length / totalQuestions;

      let fallbackScore;

      if (answerRatio === 0) {
        fallbackScore = 1.5;
      } else if (answerRatio < 0.4) {
        fallbackScore = 3.5;
      } else if (answerRatio < 0.7) {
        fallbackScore = 5.5;
      } else {
        fallbackScore = parseFloat(
          (Math.random() * 2 + 6).toFixed(1)
        );
      }

      data = {
        average_score: fallbackScore,
        strengths: mockEvaluation.strengths,
        improvements: mockEvaluation.improvements,
        final_feedback: mockEvaluation.final_feedback,
        suggestions: Array.isArray(mockEvaluation.suggestions)
          ? mockEvaluation.suggestions
          : [mockEvaluation.suggestions],
        using_mock_data: true
      };
    }

    // 🔥 SAVE INTERVIEW RESULT
    let suggestionsArray = [];

    if (Array.isArray(data.suggestions)) {
      suggestionsArray = data.suggestions;
    } else if (
      typeof data.suggestions === "string" &&
      data.suggestions.length > 0
    ) {
      suggestionsArray = data.suggestions
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    await InterviewSession.create({
      userId: req.user._id,
      domain: state.domain,
      averageScore: data.average_score,
      finalFeedback: data.final_feedback,
      suggestions: suggestionsArray,
      duration: duration || 0
    });

    res.json({
      average_score: data.average_score,
      strengths: String(data.strengths || "Good performance overall"),
      improvements: String(
        data.improvements || "Continue practicing and learning"
      ),
      final_feedback: String(
        data.final_feedback || "Great effort! Keep improving."
      ),
      suggestions: suggestionsArray,
      using_mock_data: data.using_mock_data || false
    });

  } catch (err) {
    console.error("finalEvaluate error:", err.message);
    res.status(500).json({
      message: "AI service error",
      error: err.message
    });
  }
};
