import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-iron-950 border-t border-iron-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚒️</span>
              <span className="text-lg font-bold text-white">ZayForge</span>
            </div>
            <p className="text-iron-400 text-sm leading-relaxed">
              A 2D top-down survival/RPG game inspired by Minecraft.
              Forge your destiny in a pixelated world of adventure.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/download" className="text-iron-400 hover:text-forge-400 transition-colors text-sm">
                  Download
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Sheldevv/ZayForge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-iron-400 hover:text-forge-400 transition-colors text-sm"
                >
                  Game Source
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Sheldevv/ZayForge-Launcher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-iron-400 hover:text-forge-400 transition-colors text-sm"
                >
                  Launcher Source
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-3">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Sheldevv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-iron-400 hover:text-forge-400 transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-iron-800 text-center">
          <p className="text-iron-500 text-sm">
            &copy; {new Date().getFullYear()} ZayForge. Made with 🔥 by{' '}
            <a
              href="https://github.com/Sheldevv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forge-500 hover:text-forge-400 transition-colors"
            >
              Sheldevv
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
