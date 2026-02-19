import React, { useState } from "react";
import axios from "../api/axiosInstance";

const LiveInterviewCard = () => {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const requestInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "/ai/request-live-interview",
        {
          domain: "Frontend",
          experienceLevel: "Beginner",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInterview(res.data.request);
    } catch {
      setError("Failed to schedule interview.");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    pending: "bg-amber-100 text-amber-700",
    scheduled: "bg-blue-100 text-blue-700",
    live: "bg-green-100 text-green-700",
    completed: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 h-1 rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-amber-400"></div>

      <h3 className="mb-2 text-xl font-semibold text-slate-900">Live Interview</h3>

      <p className="mb-4 text-sm text-slate-600">
        Start a real-time mock interview session with instant room access.
      </p>

      {!interview ? (
        <button
          onClick={requestInterview}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-4 py-2 font-medium text-white transition hover:from-teal-500 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Scheduling..." : "Request Live Interview"}
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              statusColor[interview.status] || "bg-slate-100"
            }`}
          >
            Status: {interview.status}
          </div>

          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-emerald-600 px-4 py-2 text-center font-medium text-white transition hover:bg-emerald-700"
          >
            Join Interview
          </a>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default LiveInterviewCard;
