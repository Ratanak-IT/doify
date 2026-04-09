import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import NavbarWrapper from "@/components/layout/NavbarWrapper";



const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow — Where teams move work forward",
  description: "Boards, lists, and cards. The simplest way to manage your projects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950" suppressHydrationWarning>
      <ThemeProvider>
        <StoreProvider>
          <NavbarWrapper/>
          {children}
        </StoreProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}
