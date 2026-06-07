'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-iron-400">Join the ZayForge community</p>
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
            <label htmlFor="username" className="block text-sm font-medium text-iron-300 mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full bg-iron-800 border border-iron-700 rounded-lg px-4 py-3 text-white placeholder-iron-500 focus:outline-none focus:border-forge-500 focus:ring-1 focus:ring-forge-500 transition-colors"
              placeholder="YourPlayerName"
            />
          </div>

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
              minLength={6}
              className="w-full bg-iron-800 border border-iron-700 rounded-lg px-4 py-3 text-white placeholder-iron-500 focus:outline-none focus:border-forge-500 focus:ring-1 focus:ring-forge-500 transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-iron-300 mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-iron-800 border border-iron-700 rounded-lg px-4 py-3 text-white placeholder-iron-500 focus:outline-none focus:border-forge-500 focus:ring-1 focus:ring-forge-500 transition-colors"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-forge-600 hover:bg-forge-500 disabled:bg-iron-700 disabled:text-iron-500 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-iron-400">
            Already have an account?{' '}
            <Link href="/login" className="text-forge-400 hover:text-forge-300 transition-colors">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
