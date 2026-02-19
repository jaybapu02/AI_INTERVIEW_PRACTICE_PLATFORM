import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "../api/axiosInstance";
import QuestionForm from "../components/QuestionsForm";

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [interviewsError, setInterviewsError] = useState("");

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await axios.get("/admin/questions");
      const data = Array.isArray(res.data) ? res.data : res.data.questions || res.data.data || [];
      setQuestions(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  const fetchScheduledInterviews = useCallback(async () => {
    try {
      setInterviewsLoading(true);
      setInterviewsError("");
      const res = await axios.get("/admin/interviews?status=scheduled");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setInterviews(data);
    } catch (err) {
      console.error("Scheduled interview fetch error:", err);
      setInterviewsError("Failed to load scheduled interviews.");
    } finally {
      setInterviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    fetchScheduledInterviews();
  }, [fetchQuestions, fetchScheduledInterviews]);

  const handleSaveQuestion = async (formData) => {
    try {
      if (editingQuestion) {
        await axios.put(`/admin/questions/${editingQuestion._id}`, formData);
        setEditingQuestion(null);
      } else {
        await axios.post("/admin/questions", formData);
      }
      fetchQuestions();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-50">
      <Navbar isLoggedIn={true} setIsLoggedIn={() => {}} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage interview questions</p>
            </div>

            <QuestionForm
              onSave={handleSaveQuestion}
              editingQuestion={editingQuestion}
              onCancelEdit={() => setEditingQuestion(null)}
            />

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:border-indigo-200/80 transition-all duration-300 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Interview Questions ({questions.length})
              </h2>

              {questions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No questions found.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {questions.map((q) => (
                    <div
                      key={q._id}
                      className="p-5 rounded-lg border border-slate-200 bg-slate-50 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 uppercase">
                          {q.type}
                        </span>
                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-200 text-slate-700">
                          {q.difficulty}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-slate-800 mb-2">{q.domain}</h4>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{q.question}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="flex-1 px-3 py-1.5 rounded text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="flex-1 px-3 py-1.5 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:border-teal-200/80 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Scheduled Live Interviews ({interviews.length})
                </h2>
                <button
                  onClick={fetchScheduledInterviews}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Refresh
                </button>
              </div>

              {interviewsLoading ? (
                <p className="text-slate-500 text-center py-8">Loading interviews...</p>
              ) : interviewsError ? (
                <p className="text-red-600 text-sm">{interviewsError}</p>
              ) : interviews.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No scheduled interviews found.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="p-5 rounded-lg border border-slate-200 bg-slate-50 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 uppercase">
                          {interview.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(interview.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h4 className="font-semibold text-slate-800">
                        {interview.userId?.name || "Student"}
                      </h4>
                      <p className="text-sm text-slate-600 mb-1">{interview.userId?.email || "-"}</p>
                      <p className="text-sm text-slate-700">
                        Domain: <span className="font-medium">{interview.domain || "-"}</span>
                      </p>
                      <p className="text-sm text-slate-700 mb-4">
                        Level: <span className="font-medium">{interview.experienceLevel || "-"}</span>
                      </p>

                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center px-3 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition"
                      >
                        Join as Interviewer
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
