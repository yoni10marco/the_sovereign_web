import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { DebugPanel } from "@/components/debug/DebugPanel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Sovereign Web",
  description: "A generative social experiment where the website itself is the prize. Submit, vote, morph.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-gray-950 text-white font-sans`}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <DebugPanel />
        </AuthProvider>
      </body>
    </html>
  );
}
