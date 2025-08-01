export default function TestTailwind() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg text-center">
        ✅ Tailwind is working!
      </div>

      <p className="mt-4 text-gray-700">
        If you see a <span className="text-blue-500 font-bold">blue box</span>, Tailwind is correctly installed.
      </p>
    </main>
  );
}