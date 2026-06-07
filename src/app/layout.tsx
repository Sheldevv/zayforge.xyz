import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ZayForge — 2D Survival RPG',
    template: '%s | ZayForge',
  },
  description:
    'ZayForge is a 2D top-down survival/RPG game inspired by Minecraft. Explore, craft, fight, and forge your destiny in a pixelated world.',
  keywords: ['zayforge', 'game', 'survival', 'rpg', '2d', 'minecraft', 'indie'],
  authors: [{ name: 'Sheldi Pierre', url: 'https://github.com/Sheldevv' }],
  openGraph: {
    title: 'ZayForge — 2D Survival RPG',
    description:
      'A 2D top-down survival/RPG game inspired by Minecraft. Forge your destiny.',
    url: 'https://zayforge.xyz',
    siteName: 'ZayForge',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
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
