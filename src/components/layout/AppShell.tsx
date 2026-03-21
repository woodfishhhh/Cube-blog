import type { ReactNode } from "react";

import { SiteNav } from "@/components/layout/SiteNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell" data-layer="foreground">
      <SiteNav />
      <div className="app-shell__content">{children}</div>
    </div>
  );
}
