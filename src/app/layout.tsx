import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mini-Z Leaderboard",
    template: "%s | Mini-Z Leaderboard",
  },
  description: "Mini-Z RC car racing lap time leaderboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
