import "./globals.css";
import type { Metadata } from "next";
import RootProviders from "./RootProviders";

export const metadata: Metadata = {
  title: "Doify — Where teams move work forward",
  description:
    "Boards, lists, and cards. The simplest way to manage your projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}