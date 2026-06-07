'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/account');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-iron-400">Log in to your ZayForge account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-iron-900/50 border border-iron-800 rounded-2xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-ember-900/20 border border-ember-700/30 text-ember-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-iron-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-iron-800 border border-iron-700 rounded-lg px-4 py-3 text-white placeholder-iron-500 focus:outline-none focus:border-forge-500 focus:ring-1 focus:ring-forge-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-iron-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-iron-800 border border-iron-700 rounded-lg px-4 py-3 text-white placeholder-iron-500 focus:outline-none focus:border-forge-500 focus:ring-1 focus:ring-forge-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-forge-600 hover:bg-forge-500 disabled:bg-iron-700 disabled:text-iron-500 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="text-center text-sm text-iron-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-forge-400 hover:text-forge-300 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
