import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-4xl font-bold text-slate-50">404</h1>
      <p className="text-slate-400">Page not found.</p>
      <Link
        href="/"
        className="text-sm text-red-400 hover:text-red-300 underline underline-offset-4"
      >
        Back to home
      </Link>
    </div>
  );
}
