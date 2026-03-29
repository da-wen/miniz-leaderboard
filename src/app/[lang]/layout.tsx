import { Geist, Geist_Mono } from "next/font/google";
import { i18n, isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTracks } from "@/lib/data";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const tracks = getTracks();

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-950 text-slate-50`}
      >
        <div className="flex min-h-screen">
          <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 border-r border-slate-800 bg-slate-900 fixed top-0 left-0 bottom-0">
            <Sidebar tracks={tracks} lang={lang} dict={dict} />
          </aside>
          <MobileNav tracks={tracks} lang={lang} dict={dict} />
          <main className="flex-1 lg:ml-64 overflow-auto min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer lang={lang} dict={dict} />
          </main>
        </div>
      </body>
    </html>
  );
}
