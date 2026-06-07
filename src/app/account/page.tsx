'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data.user);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forge-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

        <div className="bg-iron-900/50 border border-iron-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-forge-700 flex items-center justify-center text-2xl font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.username}</h2>
              <p className="text-iron-400 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-iron-800">
              <span className="text-iron-300">Username</span>
              <span className="text-white font-mono">{user.username}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-iron-800">
              <span className="text-iron-300">Email</span>
              <span className="text-white font-mono">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-iron-800">
              <span className="text-iron-300">Account ID</span>
              <span className="text-iron-500 font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/download"
            className="px-6 py-3 bg-forge-600 hover:bg-forge-500 text-white font-semibold rounded-xl transition-colors"
          >
            Download Launcher
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-iron-800 hover:bg-ember-900/50 text-ember-400 font-semibold rounded-xl border border-iron-700 hover:border-ember-700/30 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
