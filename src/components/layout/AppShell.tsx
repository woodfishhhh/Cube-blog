import type { ReactNode } from "react";

import { SiteNav } from "@/components/layout/SiteNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell" data-layer="foreground">
      <div className="app-shell__accents" aria-hidden="true">
        <span className="app-shell__accent app-shell__accent--frame" />
        <span className="app-shell__accent app-shell__accent--noise" />
        <span className="app-shell__accent app-shell__accent--rail" />
      </div>
      <SiteNav />
      <div className="app-shell__content">{children}</div>
    </div>
  );
}
