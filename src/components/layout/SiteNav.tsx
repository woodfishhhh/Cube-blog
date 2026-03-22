"use client";

import { usePathname } from "next/navigation";

import { NavBar } from "@/components/home/NavBar";
import { useHomeSceneController } from "@/components/home/use-home-scene-controller";

export function SiteNav() {
  const pathname = usePathname();
  const { activeMode, selectMode } = useHomeSceneController();
  const context = pathname?.startsWith("/posts/") ? "article" : "home";

  return <NavBar activeMode={activeMode} context={context} onSelectMode={selectMode} />;
}
