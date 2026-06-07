import Link from 'next/link';
import { getLauncherRelease } from '@/lib/github';
import DownloadCard from '@/components/DownloadCard';

export default async function HomePage() {
  const launcherRelease = await getLauncherRelease();

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-forge-950/30 via-iron-950 to-iron-950" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-forge-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-ember-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-iron-800/50 border border-iron-700 rounded-full mb-8">
              <span className="w-2 h-2 bg-forge-400 rounded-full animate-pulse" />
              <span className="text-sm text-iron-300">Now available for Windows & Linux</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Forge Your
              <span className="text-forge-400 block sm:inline"> Destiny</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-iron-400 mb-10 leading-relaxed">
              ZayForge is a 2D top-down survival/RPG game inspired by Minecraft.
              Explore vast pixelated worlds, gather resources, craft powerful gear,
              and battle dangerous foes in an endless adventure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/download"
                className="w-full sm:w-auto px-8 py-4 bg-forge-600 hover:bg-forge-500 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-forge-500/25 text-lg"
              >
                ↓ Download Now
              </Link>
              <a
                href="https://github.com/Sheldevv/ZayForge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-iron-800 hover:bg-iron-700 text-iron-200 font-semibold rounded-xl transition-all hover:scale-105 border border-iron-700"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">
            What awaits in <span className="text-forge-400">ZayForge</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌍',
                title: 'Explore Vast Worlds',
                desc: 'Traverse procedurally generated landscapes filled with diverse biomes, hidden caves, and ancient ruins waiting to be discovered.',
              },
              {
                icon: '⚔️',
                title: 'Fight & Survive',
                desc: 'Battle hostile creatures, craft weapons and armor, and build shelters to survive the perils of the night.',
              },
              {
                icon: '🔨',
                title: 'Craft & Build',
                desc: 'Gather resources, forge powerful tools, and construct your own base. The only limit is your imagination.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-iron-900/50 border border-iron-800 rounded-2xl p-8 hover:border-forge-500/30 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-iron-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Download section */}
      {launcherRelease && launcherRelease.assets.length > 0 && (
        <section className="py-20 px-4 bg-iron-900/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get the Launcher
              </h2>
              <p className="text-iron-400 text-lg">
                Download the official ZayForge Launcher to install and update the game.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {launcherRelease.assets
                .filter((a) => a.platform !== 'unknown')
                .map((asset) => (
                  <DownloadCard key={asset.name} asset={asset} />
                ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/download"
                className="text-forge-400 hover:text-forge-300 transition-colors font-medium"
              >
                View all downloads →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-forge-900/20 to-ember-900/20 border border-forge-800/30 rounded-3xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Forge Your Path?
            </h2>
            <p className="text-iron-400 text-lg mb-8">
              Create an account to save your progress, sync across devices, and join the community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3 bg-forge-600 hover:bg-forge-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                Create Account
              </Link>
              <Link
                href="/download"
                className="w-full sm:w-auto px-8 py-3 bg-iron-800 hover:bg-iron-700 text-iron-200 font-semibold rounded-xl transition-all border border-iron-700"
              >
                Download First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
