import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThreeScene from "@/components/canvas/Scene";
import { Navigation } from "@/components/dom/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WOODFISH | 3D Blog",
  description: "Immersive 3D Blog Experience",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white overflow-hidden`}>
        <Navigation />

        <div className="fixed inset-0 w-full h-full z-0">
          <ThreeScene />
        </div>

        <div className="relative z-20">{children}</div>
      </body>
    </html>
  );
}
