// app/components/CardBtn.tsx
import Link from "next/link";

type BtnTone = "blue" | "green" | "neutral";

export function CardBtn({
  href,
  children,
  tone = "neutral",
}: {
  href: string;
  children: React.ReactNode;
  tone?: BtnTone;
}) {
  const base =
    "flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition";

  const styles =
    tone === "blue"
      ? "bg-sky-600 text-white hover:bg-sky-500"
      : tone === "green"
      ? "bg-emerald-600 text-white hover:bg-emerald-500"
      : "border border-white/15 bg-white/5 text-white hover:bg-white/10";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
