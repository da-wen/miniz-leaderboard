import { i18n, isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getImprintData } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.imprint.title };
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const imprint = getImprintData();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-50 mb-8">{dict.imprint.title}</h1>

      <section className="mb-8">
        <p className="text-slate-200">{imprint.name}</p>
        {imprint.address.map((line, i) => (
          <p key={i} className="text-slate-200">{line}</p>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-2">{dict.imprint.contact}</h2>
        <p className="text-slate-300">
          {dict.imprint.email}:{" "}
          <a
            href={`mailto:${imprint.email}`}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {imprint.email}
          </a>
        </p>
      </section>
    </div>
  );
}
