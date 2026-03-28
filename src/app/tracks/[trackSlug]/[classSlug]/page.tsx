import type { Metadata } from "next";
import { getTracks, getClassBySlug, getResults, getDefaultSort, getTrackBySlug } from "@/lib/data";
import { RulesAccordion } from "@/components/RulesAccordion";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tracks = getTracks();
  const params: { trackSlug: string; classSlug: string }[] = [];

  for (const track of tracks) {
    for (const trackClass of track.classes) {
      params.push({
        trackSlug: track.slug,
        classSlug: trackClass.classSlug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackSlug: string; classSlug: string }>;
}): Promise<Metadata> {
  const { trackSlug, classSlug } = await params;
  const track = getTrackBySlug(trackSlug);
  const racingClass = getClassBySlug(classSlug);
  return {
    title: `${track?.name ?? trackSlug} - ${racingClass?.name ?? classSlug}`,
  };
}

export default async function ClassPage({
  params,
}: {
  params: Promise<{ trackSlug: string; classSlug: string }>;
}) {
  const { trackSlug, classSlug } = await params;
  const racingClass = getClassBySlug(classSlug);

  if (!racingClass) notFound();

  const results = getResults(trackSlug, classSlug);
  const defaultSort = getDefaultSort(trackSlug, classSlug);

  return (
    <>
      <RulesAccordion rules={racingClass.rules} className={racingClass.name} />
      <LeaderboardTable entries={results} defaultSort={defaultSort} />
    </>
  );
}
