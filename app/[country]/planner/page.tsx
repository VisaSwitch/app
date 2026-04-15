import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountryData, isValidCountry } from "@/data";
import { TimelinePlanner } from "@/components/tools/timeline-planner";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isValidCountry(country)) return {};
  const data = getCountryData(country);
  return {
    title: `${data!.name} Visa Checklist & Timeline Planner`,
    description: `Build your personalised ${data!.name} visa application checklist and timeline with clear milestones and deadlines.`,
  };
}

export async function generateStaticParams() {
  return [{ country: "au" }, { country: "uk" }, { country: "ca" }, { country: "jp" }];
}

export default async function PlannerPage({ params }: Props) {
  const { country } = await params;
  if (!isValidCountry(country)) notFound();
  const data = getCountryData(country)!;
  return <TimelinePlanner countryData={data} countryCode={country} />;
}
