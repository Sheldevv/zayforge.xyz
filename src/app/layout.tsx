import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zayforge.xyz"),
  title: {
    default: "ZayForge — 2D Survival RPG",
    template: "%s | ZayForge",
  },
  description:
    "ZayForge is a 2D top-down survival/RPG game inspired by Minecraft. Explore, craft, fight, and forge your destiny in a pixelated world.",
  keywords: [
    "zayforge",
    "game",
    "survival",
    "rpg",
    "2d",
    "minecraft",
    "indie",
    "top-down",
    "crafting",
    "pixel art",
    "open world",
    "love2d",
    "lua",
  ],
  authors: [{ name: "Sheldi Pierre", url: "https://github.com/Sheldevv" }],
  creator: "Sheldi Pierre",
  publisher: "Sheldevv",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://zayforge.xyz",
  },
  openGraph: {
    title: "ZayForge — 2D Survival RPG",
    description:
      "A 2D top-down survival/RPG game inspired by Minecraft. Forge your destiny in a pixelated world.",
    url: "https://zayforge.xyz",
    siteName: "ZayForge",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ZayForge — 2D Survival RPG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZayForge — 2D Survival RPG",
    description:
      "A 2D top-down survival/RPG game inspired by Minecraft. Forge your destiny.",
    creator: "@sheldevv",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "discord:site": "https://zayforge.xyz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
