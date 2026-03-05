import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Realtime Playground",
  description: "Explore Supabase Realtime features interactively",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <div className="min-h-screen p-4 font-mono text-sm">
          {" "}
          <h1 className="text-2xl font-bold mb-6">
            Realtime-js Interactive Example
          </h1>
          {children}
        </div>
        <Toaster position="bottom-left" theme="dark" />
      </body>
    </html>
  );
}
