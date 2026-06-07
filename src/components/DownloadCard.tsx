import { GitHubAsset, formatFileSize, platformIcons, typeLabels } from '@/lib/github';

interface DownloadCardProps {
  asset: GitHubAsset;
}

export default function DownloadCard({ asset }: DownloadCardProps) {
  return (
    <a
      href={asset.browser_download_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-iron-800/50 border border-iron-700 rounded-xl p-5 hover:border-forge-500/50 hover:bg-iron-800 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-2xl mr-2">{platformIcons[asset.platform]}</span>
          <span className="text-sm text-iron-400 capitalize">{asset.platform}</span>
        </div>
        <span className="px-2 py-1 bg-iron-700 rounded text-xs text-iron-300 group-hover:bg-forge-900/30 group-hover:text-forge-400 transition-colors">
          {typeLabels[asset.type]}
        </span>
      </div>

      <p className="text-white font-mono text-sm mb-2 break-all group-hover:text-forge-400 transition-colors">
        {asset.name}
      </p>

      <div className="flex items-center justify-between text-xs text-iron-400">
        <span>{formatFileSize(asset.size)}</span>
        <span className="flex items-center gap-1 group-hover:text-forge-400 transition-colors">
          ↓ Download
        </span>
      </div>
    </a>
  );
}
