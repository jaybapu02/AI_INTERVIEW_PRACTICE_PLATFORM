import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 backdrop-blur-md shadow-sm shadow-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 rounded-xl hover:opacity-90 transition-opacity duration-300">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              AI
            </div>
            <span className="hidden font-semibold text-white sm:inline">Interview Platform</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="rounded-xl px-4 py-2 text-slate-100 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-xl px-4 py-2 text-slate-100 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-xl bg-white/90 px-4 py-2 font-medium text-slate-800 transition-all duration-300 hover:bg-white active:scale-[0.98]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-slate-100 transition-all duration-300 hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 text-white font-medium shadow-md shadow-teal-500/25 hover:from-teal-500 hover:to-sky-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/30 active:scale-[0.98] transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-xl p-2 transition-all duration-300 hover:bg-white/10 active:scale-95 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-1 border-t border-white/20 py-3 md:hidden">
            <Link to="/" className="block rounded-xl px-4 py-2 text-slate-100 hover:bg-white/10" onClick={() => setMenuOpen(false)}>Home</Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="block rounded-xl px-4 py-2 text-slate-100 hover:bg-white/10" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="w-full rounded-xl px-4 py-2 text-left text-red-200 transition-colors duration-300 hover:bg-red-500/20 hover:text-red-100">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block rounded-xl px-4 py-2 text-slate-100 hover:bg-white/10" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 text-white font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
