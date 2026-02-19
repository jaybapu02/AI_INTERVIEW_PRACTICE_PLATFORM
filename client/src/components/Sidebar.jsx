import { Link, useLocation } from "react-router-dom";

const features = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "AI Role Recommender", path: "/role-recommender", icon: "🎯" },
  { name: "ATS Resume Checker", path: "/ats-score", icon: "📄" },
  { name: "Digital Twin", path: "/digital-twin", icon: "👤" },
  { name: "AI Interview", path: "/ai-interview", icon: "🎬" },
  {name: "Live Interview", path: "/live-interview", icon: "🎥"}
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 bg-white/95 backdrop-blur-sm border-r border-slate-200/80 flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-200/80">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Menu</h2>
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {features.map((f) => {
          const isActive = location.pathname === f.path;
          return (
            <Link
              key={f.path}
              to={f.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-lg">{f.icon}</span>
              <span>{f.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
