import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import InterviewPreview from "../components/InterviewPreview";
import Footer from "../components/Footer";

const roles = ["AI Engineer", "Frontend Developer", "Data Scientist", "ML Engineer"];

const highlights = [
  { value: "50K+", label: "Mock interviews completed" },
  { value: "4.9/5", label: "Average learner rating" },
  { value: "< 30s", label: "AI feedback turnaround" },
];

const features = [
  {
    title: "AI Mock Interviews",
    description: "Practice with realistic prompts and answer the way real interviewers expect.",
  },
  {
    title: "ATS Resume Scan",
    description: "Improve keyword alignment and readability before sending applications.",
  },
  {
    title: "Career Role Match",
    description: "Get role suggestions mapped to your profile, skills, and growth path.",
  },
];

const LandingPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const current = roles[roleIndex];
    const interval = setInterval(() => {
      setText(current.slice(0, i + 1));
      i += 1;
      if (i === current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setText("");
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 1200);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [roleIndex]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-amber-50/60">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -right-20 h-80 w-80 rounded-full bg-teal-200/35 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
      </div>

      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center rounded-full border border-teal-200 bg-white/80 px-4 py-1 text-xs font-semibold tracking-wide text-teal-700 shadow-sm backdrop-blur">
              Interview preparation platform
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Build confidence for your next interview with practical AI coaching
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Practice questions, get evaluation feedback, improve your resume, and move
              into interviews with a sharper preparation routine.
            </p>
            <p className="mt-5 text-slate-700">
              Preparing for: <span className="font-semibold text-teal-700">{text}</span>
              <span className="ml-1 animate-pulse text-teal-500">|</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-6 py-3 font-semibold text-white shadow-md shadow-teal-500/25 transition-all duration-300 hover:from-teal-500 hover:to-sky-500 hover:shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 px-6 py-3 font-semibold text-white shadow-md shadow-teal-500/25 transition-all duration-300 hover:from-teal-500 hover:to-sky-500 hover:shadow-lg"
                  >
                    Start for Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-300 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                >
                  <p className="text-xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <InterviewPreview />
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Why learners stay with Career Portal</h2>
              <p className="mt-2 text-slate-600">Interactive practice, immediate insights, and measurable improvement.</p>
            </div>
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="rounded-xl bg-violet-800 px-5 py-2 text-sm font-semibold text-white transition-colors"
            >
              {isLoggedIn ? "Continue Practice" : "Create Account"}
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-teal-700">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
