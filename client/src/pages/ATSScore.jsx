import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ATSScore from "../components/ATSScore";

const ATSScorePage = () => {
  const [file, setFile] = useState(null);
  const [startCheck, setStartCheck] = useState(false);
  const token = localStorage.getItem("token");

  const handleCheckScore = () => {
    if (!file) return;
    setStartCheck(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-50">
      <Navbar isLoggedIn={true} setIsLoggedIn={() => {}} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 hover:border-indigo-200/80 transition-all duration-300">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">📈 ATS Score Checker</h2>
              <p className="text-slate-600 mb-6">Upload your resume to get an ATS compatibility score.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Your Resume</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setStartCheck(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {file && <p className="mt-2 text-sm text-slate-600">Selected: {file.name}</p>}
                </div>

                <button
                  onClick={handleCheckScore}
                  disabled={!file}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
                >
                  Check ATS Score
                </button>
              </div>
            </div>

            {startCheck && <ATSScore file={file} token={token} autoFetch={true} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScorePage;
