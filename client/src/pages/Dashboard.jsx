import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import MiniChart from "../components/MiniChart";
import ActivityCard from "../components/ActivityCard";
import FocusSession from "../components/FocusSession";
import axios from "../api/axiosInstance";
import { Link } from "react-router-dom";
import LiveInterviewCard from "../components/LiveinteviewCard";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
  const [statsData, setStatsData] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatsData(res.data);
        const formatted = res.data.recentActivity.map((item) => ({
          title: "Mock Interview Completed",
          subtitle: `Score: ${item.averageScore ?? "N/A"}`,
          time: new Date(item.createdAt).toLocaleDateString()
        }));
        setActivities(formatted);
      } catch (err) {
        console.log("Failed to load dashboard");
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Interviews", value: statsData?.totalInterviews || 0, change: 0 },
    { title: "Average Score", value: `${statsData?.averageScore || 0}%`, change: 0 },
    { title: "Total Time", value: `${Math.floor((statsData?.totalDuration || 0) / 60)}m`, change: 0 },
    { title: "Confidence Score", value: `${(statsData?.averageScore || 0) * 10}%`, change: 4 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-600 mt-1">Here's your progress overview</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <StatCard key={s.title} title={s.title} value={s.value} change={s.change} />
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">🤖 Digital Twin Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Confidence Score</span>
                  <span className="font-semibold text-slate-800">{(statsData?.averageScore || 0) * 10}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Interview Consistency</span>
                  <span className="font-semibold text-slate-800">{statsData?.totalInterviews || 0} sessions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Growth Status</span>
                  <span className={`font-semibold ${(statsData?.averageScore || 0) > 7 ? 'text-green-600' : 'text-amber-600'}`}>
                    {(statsData?.averageScore || 0) > 7 ? "Improving steadily 🚀" : "Needs more practice 📈"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Trend</h3>
                <MiniChart values={statsData?.scoreHistory || [0]} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
                <div className="space-y-1">
                  {activities.length > 0 ? (
                    activities.map((a, i) => <ActivityCard key={i} {...a} />)
                  ) : (
                    <p className="text-slate-500 text-sm">No activity yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-200/80 transition-all duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Performance Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: "Technical Skills", value: (statsData?.averageScore || 0) * 10 },
                  { label: "Communication", value: (statsData?.averageScore || 0) * 8 },
                  { label: "Problem Solving", value: (statsData?.averageScore || 0) * 9 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-600">{Math.round(item.value)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(item.value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FocusSession />

            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/role-recommender"
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 hover:border-indigo-200/80 transition-all duration-300 group"
              >
                <h4 className="text-lg font-semibold text-slate-800 mb-2">🎯 AI Role Recommender</h4>
                <p className="text-slate-600 text-sm mb-3">Get personalized role suggestions and learning paths.</p>
                <span className="text-indigo-600 font-medium text-sm group-hover:underline">Start Recommender →</span>
              </Link>

              <Link
                to="/digital-twin"
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 hover:border-indigo-200/80 transition-all duration-300 group"
              >
                <h4 className="text-lg font-semibold text-slate-800 mb-2">📄 ATS Resume Checker</h4>
                <p className="text-slate-600 text-sm mb-3">Upload your resume and see an ATS compatibility score.</p>
                <span className="text-indigo-600 font-medium text-sm group-hover:underline">Check Resume →</span>
              </Link>

              <Link
                to="/ai-interview"
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/40 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 hover:border-indigo-200/80 transition-all duration-300 group"
              >
                <h4 className="text-lg font-semibold text-slate-800 mb-2">🎬 AI Interview Practice</h4>
                <p className="text-slate-600 text-sm mb-3">Simulate interview interactions and track improvement.</p>
                <span className="text-indigo-600 font-medium text-sm group-hover:underline">Start Interview →</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
