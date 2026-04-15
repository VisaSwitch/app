import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountryData, isValidCountry } from "@/data";
import { PathwaysChecker } from "@/components/tools/pathways-checker";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isValidCountry(country)) return {};
  const data = getCountryData(country);
  return {
    title: `${data!.name} Visa Pathway Checker`,
    description: `Discover every visa pathway you qualify for in ${data!.name} — complete eligibility breakdown tailored to your profile.`,
  };
}

export async function generateStaticParams() {
  return [{ country: "au" }, { country: "uk" }, { country: "ca" }, { country: "jp" }];
}

export default async function PathwaysPage({ params }: Props) {
  const { country } = await params;
  if (!isValidCountry(country)) notFound();
  const data = getCountryData(country)!;
  return <PathwaysChecker countryData={data} countryCode={country} />;
}
