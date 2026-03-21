import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Source_Serif_4 } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { SceneViewport } from "@/components/scene/SceneViewport";

import "./globals.css";

const uiFont = Archivo({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const editorialFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WOODFISH",
  description: "Persistent app shell for the WOODFISH immersive blog.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className={`${uiFont.variable} ${editorialFont.variable}`}>
        <SceneViewport />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
