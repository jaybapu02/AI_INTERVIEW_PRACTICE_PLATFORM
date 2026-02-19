import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "../api/axiosInstance";

const RoleRecommender = () => {
  const [resumeText, setResumeText] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!resumeText || resumeText.trim().length < 10) {
      setError("Please enter your resume or profile information (at least 10 characters)");
      return;
    }
    setLoading(true);
    setError("");
    setRecommendations(null);
    try {
      const res = await axios.post("/ai/predict-role", {
        resume_text: resumeText.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get recommendations");
      console.error("API Error:", err);
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 hover:border-indigo-200/80 transition-all duration-300">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">🎯 AI Role Recommender</h2>
              <p className="text-slate-600 mb-6">Paste your resume, CV, or profile description to get personalized role recommendations.</p>

              <form onSubmit={handleRecommend} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Resume or Profile</label>
                  <textarea
                    name="resume"
                    placeholder="Paste your resume, CV, or profile summary here... e.g., 'I am a computer science student skilled in Python, SQL, data analysis...'"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    required
                    autoComplete="off"
                    className="w-full h-40 px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !resumeText}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                >
                  {loading ? "Analyzing..." : "Get Role Recommendations"}
                </button>
              </form>

              {error && <p className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>}
            </div>

            {recommendations && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 hover:border-indigo-200/80 transition-all duration-300">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">🎯 Recommended Roles for You</h3>
                {recommendations.predicted_role ? (
                  <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                    <div className="text-lg font-semibold text-indigo-700">
                      {recommendations.predicted_role}
                    </div>
                  </div>
                ) : Array.isArray(recommendations.roles) && recommendations.roles.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.roles.map((role, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="font-semibold text-slate-800">
                          {role.title || role}
                        </div>
                        {role.score && (
                          <div className="text-sm text-slate-600 mt-1">
                            Match: {Math.round(role.score * 100)}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-auto">{JSON.stringify(recommendations, null, 2)}</pre>
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

export default RoleRecommender;
