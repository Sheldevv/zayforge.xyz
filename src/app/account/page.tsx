"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit username
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data.user);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const refreshUser = async () => {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  // ── Username ─────────────────────────────────────────

  const startEditUsername = () => {
    if (!user) return;
    setNewUsername(user.username);
    setUsernameError("");
    setEditingUsername(true);
  };

  const saveUsername = async () => {
    if (!user) return;
    setSavingUsername(true);
    setUsernameError("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });
      const data = await res.json();

      if (!res.ok) {
        setUsernameError(data.error || "Failed to update");
        return;
      }

      setUser(data.user);
      setEditingUsername(false);
    } catch {
      setUsernameError("Network error");
    } finally {
      setSavingUsername(false);
    }
  };

  // ── Avatar ───────────────────────────────────────────

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await fetch("/api/auth/me/avatar", {
        method: "POST",
        headers: { "Content-Type": "image/png" },
        body: file,
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      setUser(data.user);
    } catch {
      alert("Upload failed");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAvatar = async () => {
    if (!confirm("Remove your profile picture?")) return;
    setUploadingAvatar(true);
    try {
      const res = await fetch("/api/auth/me/avatar", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch {
      alert("Failed to remove avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Delete Account ───────────────────────────────────

  const deleteAccount = async () => {
    if (deleteConfirmText !== user?.username) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/auth/me", { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to delete account");
      }
    } catch {
      alert("Network error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Logout ───────────────────────────────────────────

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  // ── Render ───────────────────────────────────────────

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

        {/* ── Profile card ───────────────────────────── */}
        <div className="bg-iron-900/50 border border-iron-800 rounded-2xl p-8 mb-6">
          {/* Avatar row */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-lg border-2 border-forge-600/50"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-forge-700 flex items-center justify-center text-2xl font-bold text-white border-2 border-forge-600/30">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              {/* upload overlay */}
              <label className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-white text-xs font-medium">
                  {uploadingAvatar ? "..." : "16×16"}
                </span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.username}
              </h2>
              <p className="text-iron-400 text-sm">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="text-xs text-forge-400 hover:text-forge-300 transition-colors"
                >
                  {user.avatar ? "Change pfp" : "Upload pfp"}
                </button>
                {user.avatar && (
                  <button
                    onClick={removeAvatar}
                    disabled={uploadingAvatar}
                    className="text-xs text-ember-400 hover:text-ember-300 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Username (editable) */}
            <div className="flex justify-between items-center py-3 border-b border-iron-800">
              <span className="text-iron-300">Username</span>
              {editingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-36 bg-iron-800 border border-iron-700 rounded px-2 py-1 text-white text-sm font-mono focus:outline-none focus:border-forge-500"
                    maxLength={20}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveUsername();
                      if (e.key === "Escape") setEditingUsername(false);
                    }}
                  />
                  <button
                    onClick={saveUsername}
                    disabled={savingUsername}
                    className="text-forge-400 hover:text-forge-300 text-sm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingUsername(false)}
                    className="text-iron-400 hover:text-iron-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{user.username}</span>
                  <button
                    onClick={startEditUsername}
                    className="text-iron-500 hover:text-forge-400 text-sm transition-colors"
                  >
                    ✎
                  </button>
                </div>
              )}
            </div>
            {usernameError && (
              <p className="text-ember-400 text-xs -mt-2">{usernameError}</p>
            )}

            {/* Email (read-only) */}
            <div className="flex justify-between items-center py-3 border-b border-iron-800">
              <span className="text-iron-300">Email</span>
              <span className="text-white font-mono">{user.email}</span>
            </div>

            {/* Created */}
            <div className="flex justify-between items-center py-3 border-b border-iron-800">
              <span className="text-iron-300">Joined</span>
              <span className="text-iron-400 text-sm">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* ID */}
            <div className="flex justify-between items-center py-3">
              <span className="text-iron-300">Account ID</span>
              <span className="text-iron-500 font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/download"
            className="px-6 py-3 bg-forge-600 hover:bg-forge-500 text-white font-semibold rounded-xl transition-colors"
          >
            Download Launcher
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-iron-800 hover:bg-iron-700 text-iron-300 font-semibold rounded-xl border border-iron-700 transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-ember-950/20 border border-ember-800/30 rounded-2xl p-6">
          <h3 className="text-ember-400 font-semibold mb-2">Danger Zone</h3>
          <p className="text-iron-400 text-sm mb-4">
            Permanently delete your account and all game saves. This cannot be
            undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-ember-900/40 hover:bg-ember-900/60 text-ember-400 border border-ember-700/30 rounded-lg text-sm font-medium transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-ember-300 text-sm">
                Type <strong className="font-mono">{user.username}</strong> to
                confirm:
              </p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-iron-800 border border-ember-700/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ember-500"
                placeholder={user.username}
              />
              <div className="flex gap-3">
                <button
                  onClick={deleteAccount}
                  disabled={deleteConfirmText !== user.username || deleting}
                  className="px-4 py-2 bg-ember-600 hover:bg-ember-500 disabled:bg-iron-700 disabled:text-iron-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {deleting ? "Deleting..." : "Yes, delete my account"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="px-4 py-2 bg-iron-800 hover:bg-iron-700 text-iron-300 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
