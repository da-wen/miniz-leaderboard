import { redirect } from "next/navigation";
import { getTracks, getTrackBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tracks = getTracks();
  return tracks.map((track) => ({ trackSlug: track.slug }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ lang: string; trackSlug: string }>;
}) {
  const { lang, trackSlug } = await params;
  const track = getTrackBySlug(trackSlug);

  if (!track) notFound();

  const firstClass = track.classes[0].classSlug;
  redirect(`/${lang}/tracks/${trackSlug}/${firstClass}`);
}
