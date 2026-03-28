import type { Metadata } from "next";
import { getTracks, getTrackBySlug, getClasses } from "@/lib/data";
import { ClassTabs } from "@/components/ClassTabs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tracks = getTracks();
  return tracks.map((track) => ({ trackSlug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);
  return { title: track?.name ?? trackSlug };
}

export default async function TrackLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ trackSlug: string }>;
}) {
  const { trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);

  if (!track) notFound();

  const allClasses = getClasses();
  const trackClasses = track.classes
    .map((tc) => allClasses.find((c) => c.slug === tc.classSlug)!)
    .filter(Boolean);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-50">{track.name}</h1>
      <ClassTabs trackSlug={trackSlug} classes={trackClasses} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
