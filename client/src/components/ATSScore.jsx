import React, { useEffect, useState } from "react";
import { getAtsScore } from "../api/aiService";

const ATSScore = ({ file, token, autoFetch = true }) => {
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file || !autoFetch) return;
    const fetchScore = async () => {
      setLoading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("resume", file);
        const res = await getAtsScore(formData, token);
        setAtsData(res?.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch ATS score");
        setAtsData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [file, token, autoFetch]);

  if (!file) return null;

  const score = atsData?.ats_score ?? atsData?.score ?? null;
  const strength = atsData?.strength || atsData?.strengths || null;
  const suggestion = atsData?.suggestion || atsData?.suggestions || null;
  const weakness = atsData?.weakness || atsData?.weaknesses || null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:border-indigo-200/80 transition-all duration-300">
      <h4 className="text-lg font-semibold text-slate-800 mb-4">ATS Score Analysis</h4>
      {loading && <div className="text-slate-600 text-sm">Checking ATS...</div>}
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      {score !== null && score !== undefined && (
        <div className="space-y-6">
          <div className="text-center p-6 bg-indigo-50 rounded-xl">
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {typeof score === 'number' ? Math.round(score) : score}%
            </div>
            <div className="text-slate-600 mb-4">ATS Compatibility</div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(typeof score === 'number' ? Math.round(score) : parseInt(score) || 0, 100)}%` }}
              />
            </div>
            <p className={`mt-4 font-medium ${
              score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600"
            }`}>
              {score >= 80 ? "✅ Excellent" : score >= 60 ? "⚠️ Good" : "❌ Needs Work"}
            </p>
          </div>

          {strength && (
            <div>
              <h5 className="font-semibold text-slate-800 mb-2">💪 Strengths</h5>
              {Array.isArray(strength) ? (
                <ul className="space-y-1 list-disc list-inside text-slate-700">
                  {strength.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-slate-700">{strength}</p>
              )}
            </div>
          )}

          {suggestion && (
            <div>
              <h5 className="font-semibold text-slate-800 mb-2">💡 Suggestions</h5>
              {Array.isArray(suggestion) ? (
                <ul className="space-y-1 list-disc list-inside text-slate-700">
                  {suggestion.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-slate-700">{suggestion}</p>
              )}
            </div>
          )}

          {weakness && (
            <div>
              <h5 className="font-semibold text-slate-800 mb-2">⚠️ Weaknesses</h5>
              {Array.isArray(weakness) ? (
                <ul className="space-y-1 list-disc list-inside text-slate-700">
                  {weakness.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-slate-700">{weakness}</p>
              )}
            </div>
          )}

          {!strength && !suggestion && !weakness && atsData && (
            <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-400">
              <h5 className="font-semibold text-slate-800 mb-2">📊 Full Response Data</h5>
              <pre className="text-xs overflow-auto">{JSON.stringify(atsData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSScore;
