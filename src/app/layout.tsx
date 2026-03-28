import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getTracks } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "Mini-Z Leaderboard",
    template: "%s | Mini-Z Leaderboard",
  },
  description: "Mini-Z RC car racing lap time leaderboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tracks = getTracks();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-950 text-slate-50`}
      >
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 border-r border-slate-800 bg-slate-900 fixed top-0 left-0 bottom-0">
            <Sidebar tracks={tracks} />
          </aside>

          {/* Mobile nav */}
          <MobileNav tracks={tracks} />

          {/* Main content */}
          <main className="flex-1 lg:ml-64 overflow-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
