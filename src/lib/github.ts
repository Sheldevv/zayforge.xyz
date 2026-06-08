export interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
  download_count: number;
  content_type: string;
  platform: "windows" | "linux" | "macos" | "unknown";
  type: "portable" | "installer" | "appimage" | "deb" | "unknown";
}

export interface ReleaseInfo {
  tag: string;
  name: string;
  publishedAt: string;
  body: string;
  htmlUrl: string;
  assets: GitHubAsset[];
}

function classifyAsset(name: string): {
  platform: GitHubAsset["platform"];
  type: GitHubAsset["type"];
} {
  const lower = name.toLowerCase();
  let platform: GitHubAsset["platform"] = "unknown";
  let type: GitHubAsset["type"] = "unknown";

  if (lower.includes(".exe") || lower.includes(".msi")) {
    platform = "windows";
    type =
      lower.includes("setup") || lower.includes("install")
        ? "installer"
        : "portable";
  } else if (lower.includes(".appimage")) {
    platform = "linux";
    type = "appimage";
  } else if (lower.includes(".deb")) {
    platform = "linux";
    type = "deb";
  } else if (lower.includes(".dmg") || lower.includes(".pkg")) {
    platform = "macos";
    type = "installer";
  }

  return { platform, type };
}

async function fetchRelease(
  owner: string,
  repo: string,
  tag?: string,
): Promise<ReleaseInfo | null> {
  const url = tag
    ? `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`
    : `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const headers: Record<string, string> = {
    "User-Agent": "ZayForge-Website/1.0",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(url, { headers, next: { revalidate: 300 } });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      tag: data.tag_name,
      name: data.name || data.tag_name,
      publishedAt: data.published_at,
      body: data.body || "",
      htmlUrl: data.html_url,
      assets: (data.assets || []).map((a: Record<string, unknown>) => {
        const { platform, type } = classifyAsset(String(a.name || ""));
        return {
          name: String(a.name || ""),
          size: Number(a.size || 0),
          browser_download_url: String(a.browser_download_url || ""),
          download_count: Number(a.download_count || 0),
          content_type: String(a.content_type || ""),
          platform,
          type,
        };
      }),
    };
  } catch {
    return null;
  }
}

/** Launcher release pinned to v1.2 — change this to bump the promoted version. */
const LAUNCHER_TAG = "v1.2";

export async function getLauncherRelease(): Promise<ReleaseInfo | null> {
  return fetchRelease("Sheldevv", "ZayForge-Launcher", LAUNCHER_TAG);
}

export async function getGameRelease(): Promise<ReleaseInfo | null> {
  return fetchRelease("Sheldevv", "ZayForge");
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const platformIcons: Record<string, string> = {
  windows: "⊞",
  linux: "🐧",
  macos: "🍎",
  unknown: "📦",
};

export const typeLabels: Record<string, string> = {
  portable: "Portable",
  installer: "Installer",
  appimage: "AppImage",
  deb: "Debian Package",
  unknown: "Download",
};
