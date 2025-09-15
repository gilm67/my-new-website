import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: add header/nav here */}
      <main className="flex-1">{children}</main>
      {/* TODO: add footer here */}
    </div>
  );
}
