"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  username: string;
  avatar: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const isActive = (path: string) =>
    pathname === path ? "text-forge-400" : "text-iron-300 hover:text-forge-400";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-iron-950/80 backdrop-blur-md border-b border-iron-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">⚒️</span>
            <span className="text-xl font-bold text-white group-hover:text-forge-400 transition-colors">
              ZayForge
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`${isActive("/")} transition-colors`}>
              Home
            </Link>
            <Link
              href="/download"
              className={`${isActive("/download")} transition-colors`}
            >
              Download
            </Link>
            <Link
              href="/docs"
              className={`${isActive("/docs")} transition-colors`}
            >
              API Docs
            </Link>

            {loading ? (
              <div className="w-20 h-8 bg-iron-800 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/account"
                  className={`${isActive("/account")} flex items-center gap-2 transition-colors`}
                >
                  <div className="w-7 h-7 rounded-full bg-forge-700 flex items-center justify-center text-sm font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-iron-400 hover:text-ember-400 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-iron-300 hover:text-forge-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-forge-600 hover:bg-forge-500 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-iron-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              href="/"
              className={`block py-2 ${isActive("/")}`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/download"
              className={`block py-2 ${isActive("/download")}`}
              onClick={() => setMobileOpen(false)}
            >
              Download
            </Link>
            <Link
              href="/docs"
              className={`block py-2 ${isActive("/docs")}`}
              onClick={() => setMobileOpen(false)}
            >
              API Docs
            </Link>
            {user ? (
              <>
                <Link
                  href="/account"
                  className={`block py-2 ${isActive("/account")}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Account — {user.username}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="block py-2 text-ember-400 hover:text-ember-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-iron-300 hover:text-forge-400"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-forge-400 hover:text-forge-300 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
