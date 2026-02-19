import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LiveInterviewCard from "../components/LiveinteviewCard";
import Footer from "../components/Footer";

const LiveInterviewPage = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar isLoggedIn={true} setIsLoggedIn={() => {}} />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
          <div className="p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              <section className="rounded-3xl border border-teal-200/60 bg-gradient-to-r from-teal-50 via-sky-50 to-amber-50 p-6 lg:p-8 shadow-sm">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Live Interview Center
                </h1>
                <p className="mt-2 max-w-2xl text-slate-700">
                  Schedule and join real-time mock interview sessions with a
                  cleaner, professional experience.
                </p>
              </section>

              <LiveInterviewCard />
            </div>
          </div>

          <div className="mt-auto">
    
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewPage;
