import type { Metadata } from 'next';
import { getLauncherRelease, getGameRelease, formatFileSize } from '@/lib/github';
import DownloadCard from '@/components/DownloadCard';

export const metadata: Metadata = {
  title: 'Download',
  description: 'Download the official ZayForge Launcher and game files.',
};

export default async function DownloadPage() {
  const launcherRelease = await getLauncherRelease();
  const gameRelease = await getGameRelease();

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Downloads
          </h1>
          <p className="text-iron-400 text-lg max-w-2xl mx-auto">
            Download the official ZayForge Launcher to get started.
            The launcher handles game installation, updates, and account management.
          </p>
        </div>

        {/* Launcher Downloads */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🚀</span>
            <div>
              <h2 className="text-2xl font-bold text-white">ZayForge Launcher</h2>
              {launcherRelease && (
                <p className="text-sm text-iron-400">
                  {launcherRelease.name} —{' '}
                  {new Date(launcherRelease.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          {launcherRelease && launcherRelease.assets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {launcherRelease.assets.map((asset) => (
                <DownloadCard key={asset.name} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="bg-iron-900/50 border border-iron-800 rounded-xl p-8 text-center">
              <p className="text-iron-400">No launcher releases available yet.</p>
              <a
                href="https://github.com/Sheldevv/ZayForge-Launcher"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forge-400 hover:text-forge-300 mt-2 inline-block"
              >
                Check GitHub →
              </a>
            </div>
          )}

          {launcherRelease?.body && (
            <div className="mt-6 bg-iron-900/50 border border-iron-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Release Notes</h3>
              <p className="text-iron-400 whitespace-pre-wrap text-sm">{launcherRelease.body}</p>
            </div>
          )}
        </div>

        {/* Game Source / Direct Download */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🎮</span>
            <div>
              <h2 className="text-2xl font-bold text-white">ZayForge Game</h2>
              <p className="text-sm text-iron-400">
                The game itself — install via the launcher or build from source
              </p>
            </div>
          </div>

          {gameRelease && gameRelease.assets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameRelease.assets.map((asset) => (
                <DownloadCard key={asset.name} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="bg-iron-900/50 border border-iron-800 rounded-xl p-8 text-center">
              <p className="text-iron-400 mb-4">
                The game is distributed through the launcher. No standalone releases yet.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://github.com/Sheldevv/ZayForge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-iron-800 hover:bg-iron-700 text-iron-200 rounded-xl transition-all border border-iron-700"
                >
                  View Game Source →
                </a>
                <a
                  href="https://github.com/Sheldevv/ZayForge/archive/refs/heads/main.zip"
                  className="px-6 py-3 bg-forge-600 hover:bg-forge-500 text-white rounded-xl transition-all"
                >
                  Download Source ZIP
                </a>
              </div>
            </div>
          )}
        </div>

        {/* System Requirements */}
        <div className="mt-16 bg-iron-900/50 border border-iron-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-forge-400 font-semibold mb-3">Minimum</h3>
              <ul className="space-y-2 text-sm text-iron-400">
                <li><strong className="text-iron-300">OS:</strong> Windows 10+ / Ubuntu 20.04+</li>
                <li><strong className="text-iron-300">CPU:</strong> Dual-core 2.0 GHz</li>
                <li><strong className="text-iron-300">RAM:</strong> 4 GB</li>
                <li><strong className="text-iron-300">GPU:</strong> OpenGL 3.3 capable</li>
                <li><strong className="text-iron-300">Storage:</strong> 500 MB</li>
              </ul>
            </div>
            <div>
              <h3 className="text-ember-400 font-semibold mb-3">Recommended</h3>
              <ul className="space-y-2 text-sm text-iron-400">
                <li><strong className="text-iron-300">OS:</strong> Windows 11 / Ubuntu 22.04+</li>
                <li><strong className="text-iron-300">CPU:</strong> Quad-core 3.0 GHz</li>
                <li><strong className="text-iron-300">RAM:</strong> 8 GB</li>
                <li><strong className="text-iron-300">GPU:</strong> OpenGL 4.5 capable</li>
                <li><strong className="text-iron-300">Storage:</strong> 1 GB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
