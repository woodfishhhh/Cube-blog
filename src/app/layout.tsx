import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThreeScene from "@/components/canvas/Scene";
import { getPosts, getAuthorInfo, getFriendLinks } from "@/lib/data";
import { Navigation } from "@/components/dom/Navigation";
import { ReadingOverlay } from "@/components/dom/ReadingOverlay";
import { SlideController } from "@/components/dom/SlideController";
import { UIOverlay } from "@/components/dom/UIOverlay";

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
  const posts = await getPosts();
  const authorInfo = await getAuthorInfo();
  const friendLinks = await getFriendLinks();

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white overflow-hidden`}>
        <SlideController>
          <Navigation />

          <div className="fixed inset-0 w-full h-full z-0">
            <ThreeScene />
          </div>

          <UIOverlay
            posts={posts}
            authorInfo={authorInfo}
            friendLinks={friendLinks}
          />

          <ReadingOverlay posts={posts} />
        </SlideController>
      </body>
    </html>
  );
}
