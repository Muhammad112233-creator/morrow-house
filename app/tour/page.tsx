import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import TourExperience from "@/components/tour-experience";

export const metadata: Metadata = {
  title: "Walk through Morrow House",
  description: "A small interactive 3D visit through the rooms of Morrow House in Lahore.",
};

export default function TourPage() {
  return (
    <>
      <SiteHeader variant="tour" />
      <TourExperience />
    </>
  );
}
