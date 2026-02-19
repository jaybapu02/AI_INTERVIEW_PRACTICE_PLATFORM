import React, { useState } from "react";

const keywords = [
  "experience", "project", "built", "developed", "team", "technology",
  "react", "node", "python", "problem", "solution", "impact", "result",
  "improved", "challenge", "mern", "mongodb", "express",
];

function calculateInterviewScore(answer) {
  if (!answer || !answer.trim()) {
    return { score: 0, feedback: "Please enter an answer before evaluation." };
  }
  const text = answer.toLowerCase();
  const words = text.split(/\s+/);
  let score = 0;
  keywords.forEach((word) => { if (text.includes(word)) score += 5; });
  if (words.length > 50) score += 15;
  else if (words.length > 25) score += 10;
  else score -= 10;
  if (/\d+/.test(text)) score += 5;
  score = Math.max(0, Math.min(score, 100));
  let feedback = score >= 80 ? "Strong answer 👍 Clear project explanation." : score >= 60 ? "Good answer. Add more impact/results." : "Try explaining your role, tech stack, and outcome.";
  return { score, feedback };
}

const InterviewPreview = () => {
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEvaluate = () => {
    setLoading(true);
    setScore(0);
    setTimeout(() => {
      const result = calculateInterviewScore(answer);
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setScore(current);
        if (current >= result.score) {
          clearInterval(interval);
          setFeedback(result.feedback);
          setLoading(false);
        }
      }, 20);
    }, 1200);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 w-full max-w-md hover:shadow-2xl hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">🎤 Live AI interview preview</h3>
      <div className="bg-slate-100/80 rounded-xl px-4 py-3 text-slate-700 text-sm mb-4 border border-slate-200/60">
        Tell me about yourself and your recent project.
      </div>
      <textarea
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full h-28 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 focus:bg-white outline-none resize-none transition-all duration-300"
      />
      <button
        onClick={handleEvaluate}
        className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-300"
      >
        Evaluate answer
      </button>
      {loading && <p className="mt-3 text-sm text-slate-500">AI is analyzing your answer…</p>}
      {score !== null && !loading && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700">Practice score: {score} / 100</p>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-600">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPreview;
