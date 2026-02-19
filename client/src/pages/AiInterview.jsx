import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "../api/axiosInstance";import ReactMarkdown from "react-markdown";

const QUESTION_TIME = 60;

const AIInterview = () => {
  const [domain, setDomain] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [interviewState, setInterviewState] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const token = localStorage.getItem("token");

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognition.onerror = (event) => console.error("Speech error:", event.error);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const stopInterview = () => {
    if (interviewEnded || finalResult) return;
    setInterviewEnded(true);
    setQuestions([]);
    setError("Interview terminated due to tab switching.");
    alert("Tab switching detected. Interview ended.");
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && questions.length > 0 && !finalResult) stopInterview();
    };
    const handleWindowBlur = () => {
      if (questions.length > 0 && !finalResult) stopInterview();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [questions, finalResult, interviewEnded]);

  useEffect(() => {
    if (!questions.length || finalResult || interviewEnded) return;
    if (timeLeft <= 0) {
      handleNext(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions, finalResult, interviewEnded]);

  useEffect(() => {
    if (!questions.length) return;
    setTimeLeft(QUESTION_TIME);
  }, [currentIndex, questions.length]);

  const handleStart = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setFinalResult(null);
    setAnswer("");
    setInterviewEnded(false);
    try {
      const res = await axios.post("/ai/start", { domain });
      setQuestions(res.data?.questions || []);
      setInterviewState(res.data?.state || null);
    } catch (err) {
      console.error(err);
      setError("Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (timeout = false) => {
    if (interviewEnded) return;
    const currentAnswer = timeout || !answer.trim() ? "No answer submitted." : answer;
    const updatedAnswers = [...answers, currentAnswer];
    setAnswers(updatedAnswers);
    setAnswer("");
    if (currentIndex >= questions.length - 1) {
      handleFinishInterview(updatedAnswers);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleFinishInterview = async (finalAnswers) => {
    if (interviewEnded) return;
    setLoading(true);
    try {
      const res = await axios.post("/ai/final_evaluate", {
        questions,
        answers: finalAnswers,
        state: interviewState,
        duration: questions.length * QUESTION_TIME
      });
      setFinalResult(res.data);
    } catch {
      setError("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-50">
      <Navbar isLoggedIn={true} setIsLoggedIn={() => {}} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {!questions.length && !finalResult && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">🎬 AI Interview Practice</h2>
                <p className="text-slate-600 mb-6">Practice real interview questions with AI feedback.</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter domain (e.g., Python, Frontend, Backend)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 focus:bg-white outline-none transition-all duration-300"
                  />
                  <button
                    onClick={handleStart}
                    disabled={loading || !domain.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                  >
                    {loading ? "Starting..." : "Start Interview"}
                  </button>
                </div>
                {error && <p className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
              </div>
            )}

            {questions.length > 0 && !finalResult && !interviewEnded && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 space-y-6 hover:border-indigo-200/80 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Question {currentIndex + 1} / {questions.length}
                  </h3>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${
                    timeLeft <= 10 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    ⏱ {timeLeft}s
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <p className="text-lg text-slate-800 leading-relaxed">{questions[currentIndex]}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Answer</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type or speak your answer..."
                    className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 focus:bg-white outline-none resize-none transition-all duration-300"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      isRecording
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isRecording ? "🎤 Listening..." : "🎤 Start Voice Answer"}
                  </button>
                  <button
                    onClick={() => handleNext(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    {currentIndex >= questions.length - 1 ? "Finish Interview" : "Next Question"}
                  </button>
                </div>
              </div>
            )}

            {finalResult && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 hover:border-indigo-200/80 transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">🎉 Interview Completed</h3>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-100 rounded-xl">
                    <span className="text-sm text-slate-600">Average Score:</span>
                    <span className="text-2xl font-bold text-indigo-700">
                      {finalResult.average_score ?? "N/A"} / 10
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none text-slate-700">
                  <ReactMarkdown>{finalResult.final_feedback}</ReactMarkdown>
                </div>
                {finalResult.suggestions && Array.isArray(finalResult.suggestions) && finalResult.suggestions.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3">💡 Suggestions</h4>
                    <ul className="space-y-2">
                      {finalResult.suggestions.map((s, i) => (
                        <li key={i} className="text-slate-600">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterview;
