import { redirect } from "next/navigation";
import { getTracks } from "@/lib/data";

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const tracks = getTracks();
  const firstTrack = tracks[0];
  const firstClass = firstTrack.classes[0].classSlug;
  redirect(`/${lang}/tracks/${firstTrack.slug}/${firstClass}`);
}
