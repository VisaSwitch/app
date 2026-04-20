import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCountryData, isValidCountry } from "@/data";
import { VisaGuide } from "@/components/tools/visa-guide";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isValidCountry(country)) return {};
  const data = getCountryData(country);
  return {
    title: `${data!.name} Visa Guide — Step-by-Step`,
    description: `Your complete step-by-step visa journey for ${data!.name}. Find your pathway, check eligibility, build a plan, and track your application to approval.`,
  };
}

export async function generateStaticParams() {
  return [{ country: "au" }, { country: "uk" }, { country: "ca" }, { country: "jp" }];
}

export default async function GuidePage({ params }: Props) {
  const { country } = await params;
  if (!isValidCountry(country)) notFound();
  const data = getCountryData(country)!;
  return (
    <Suspense>
      <VisaGuide countryData={data} countryCode={country} />
    </Suspense>
  );
}
