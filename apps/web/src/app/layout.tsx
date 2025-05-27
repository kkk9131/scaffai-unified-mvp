import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { ScaffoldProvider } from "../contexts/ScaffoldContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScaffAI - 足場設計MVP",
  description: "Building scaffolding design made simple",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ScaffoldProvider>
            {children}
          </ScaffoldProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}