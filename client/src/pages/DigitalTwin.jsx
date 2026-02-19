import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "../api/axiosInstance";

const DigitalTwin = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const uploadResume = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post("/ai/digital-twin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">👤 Digital Twin</h2>
              <p className="text-slate-600 mb-6">Upload your resume and get an ATS compatibility score and improvement suggestions.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Your Resume</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {file && <p className="mt-2 text-sm text-slate-600">Selected: {file.name}</p>}
                </div>
                <button
                  onClick={uploadResume}
                  disabled={loading || !file}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                >
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
              </div>

              {error && <p className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
            </div>

            {result && <ResumeAnalysisDisplay result={result} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// const ResumeAnalysisDisplay = ({ result }) => {
//   const data = result;
//   if (!data || Object.keys(data).length === 0) {
//     return <p className="p-4 bg-red-50 text-red-700 rounded-lg">No data received from analysis</p>;
//   }

//   const atsScore = data.ats_score !== undefined ? data.ats_score : data.score !== undefined ? data.score : data.atp_score !== undefined ? data.atp_score : null;
//   const keywords = data.keywords || data.matched_keywords || data.found_keywords || [];
//   const missingKeywords = data.missing_keywords || data.missing || data.suggestions || [];
//   const improvements = data.improvements || data.suggestions || data.tips || [];
//   const summary = data.summary || data.overview || data.analysis || "";
//   const profile = data.profile || data.parsed_resume || null;
//   const applyReadyRoles = data.apply_ready_roles || data.apply_ready || data.recommended_roles || data.recommended_roles_list || data.roles || data.suggested_roles || [];
//   const hasStructuredData = atsScore !== null || keywords.length > 0 || missingKeywords.length > 0;

//   return (
//     <div className="space-y-6">
//       {atsScore !== null && (
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
//           <div className="text-6xl font-bold text-indigo-600 mb-2">{Math.round(atsScore * 100 || atsScore)}</div>
//           <div className="text-slate-600 mb-4">ATS Compatibility Score</div>
//           <div className="h-3 bg-slate-200 rounded-full overflow-hidden max-w-md mx-auto">
//             <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(Math.round(atsScore * 100 || atsScore), 100)}%` }} />
//           </div>
//           <p className={`mt-4 font-medium ${
//             atsScore >= 0.8 ? "text-green-600" : atsScore >= 0.6 ? "text-amber-600" : "text-red-600"
//           }`}>
//             {atsScore >= 0.8 ? "✅ Excellent - Your resume is ATS friendly!" : atsScore >= 0.6 ? "⚠️ Good - Some improvements needed" : "❌ Needs Work - Follow suggestions below"}
//           </p>
//         </div>
//       )}

//       {summary && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">📋 Summary</h3>
//           <p className="text-slate-700">{summary}</p>
//         </div>
//       )}

//       {keywords.length > 0 && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">✅ Keywords Found</h3>
//           <div className="flex flex-wrap gap-2">
//             {keywords.map((kw, idx) => (
//               <span key={idx} className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
//                 {typeof kw === 'object' ? kw.keyword || kw.name || JSON.stringify(kw) : kw}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {missingKeywords.length > 0 && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">⚠️ Missing Keywords</h3>
//           <p className="text-slate-600 text-sm mb-3">Consider adding these to improve your ATS score:</p>
//           <div className="flex flex-wrap gap-2">
//             {missingKeywords.map((kw, idx) => (
//               <span key={idx} className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700 text-sm font-medium">
//                 {typeof kw === 'object' ? kw.keyword || kw.name || JSON.stringify(kw) : kw}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {improvements.length > 0 && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">💡 Suggestions for Improvement</h3>
//           <ul className="space-y-2">
//             {improvements.map((imp, idx) => (
//               <li key={idx} className="text-slate-700">
//                 <strong>Tip {idx + 1}:</strong> {typeof imp === 'object' ? JSON.stringify(imp) : imp}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {applyReadyRoles.length > 0 && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">🚀 Apply-ready Roles</h3>
//           <p className="text-slate-600 text-sm mb-4">Jobs/roles your resume is ready for — consider applying to these.</p>
//           <div className="grid sm:grid-cols-2 gap-3">
//             {applyReadyRoles.map((r, i) => {
//               const name = typeof r === 'string' ? r : r.name || r.title || JSON.stringify(r);
//               const score = typeof r === 'object' && (r.score || r.confidence || r.match) ? (r.score || r.confidence || r.match) : null;
//               return (
//                 <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
//                   <div className="font-medium text-slate-800">{name}</div>
//                   {score !== null && <div className="text-sm text-slate-600 mt-1">Match: {Math.round(score * 100 || score)}%</div>}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {profile && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">👤 Parsed Resume Information</h3>
//           <div className="space-y-2">
//             {Object.entries(profile).map(([key, value]) => (
//               <div key={key} className="flex gap-4">
//                 <strong className="text-slate-700 w-32">{key}:</strong>
//                 <span className="text-slate-600">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {!hasStructuredData && (
//         <div className="bg-white rounded-xl border border-slate-200 p-6">
//           <h3 className="text-lg font-semibold text-slate-800 mb-3">📊 Analysis Results</h3>
//           <pre className="bg-slate-50 p-4 rounded-lg overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

const ResumeAnalysisDisplay = ({ result }) => {
  if (!result) return null;

  const score = result.career_readiness_score || 0;
  const summary = result.summary || "";
  const skillGaps = result.skill_gaps || [];
  const learningPath = result.recommended_learning_path || [];
  const roles = result.recommended_roles || [];

  return (
    <div className="space-y-6">

      {/* Career Score */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          🎯 Career Readiness Score
        </h3>

        <div className="text-6xl font-bold text-indigo-600">{score}%</div>

        <div className="h-3 bg-slate-200 rounded-full overflow-hidden max-w-md mx-auto mt-4">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>

        <p className="mt-4 text-slate-600">
          {score >= 75
            ? "🚀 Strong profile — close to industry-ready."
            : score >= 50
            ? "⚠️ Good foundation — needs improvement."
            : "📈 Early stage — focus on learning roadmap."}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-3">📋 AI Summary</h3>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}


      {/* Skill Gaps */}
      {skillGaps.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-3">⚠️ Skill Gaps</h3>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((gap, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-sm"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Learning Path */}
      {learningPath.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-3">📈 Learning Path</h3>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700">
            {learningPath.map((step, i) => (
              <li key={i}>{String(step).replace(/\*\*/g, "")}</li>
            ))}
          </ol>
        </div>
      )}


    </div>
  );
};


export default DigitalTwin;
