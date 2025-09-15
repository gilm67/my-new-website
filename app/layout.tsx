import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/src/components/AppShell"; // keep if you use it for header/footer

export const metadata: Metadata = {
  title: "Exec Partners",
  description: "…",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
