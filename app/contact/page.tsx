// app/contact/page.tsx
export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="ep-container py-12">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-3 text-white/80">
        This is the contact page. (You can expand with your real form or info.)
      </p>
    </div>
  );
}
