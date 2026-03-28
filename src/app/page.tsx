import { redirect } from "next/navigation";
import { getTracks } from "@/lib/data";

export default function HomePage() {
  const tracks = getTracks();
  const firstTrack = tracks[0];
  const firstClass = firstTrack.classes[0].classSlug;
  redirect(`/tracks/${firstTrack.slug}/${firstClass}`);
}
