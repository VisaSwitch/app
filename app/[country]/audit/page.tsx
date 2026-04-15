import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountryData, isValidCountry } from "@/data";
import { RiskAudit } from "@/components/tools/risk-audit";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isValidCountry(country)) return {};
  const data = getCountryData(country);
  return {
    title: `${data!.name} Visa Risk Audit`,
    description: `Analyse your ${data!.name} visa application risk before lodging. Get actionable next steps to maximise your approval chances.`,
  };
}

export async function generateStaticParams() {
  return [{ country: "au" }, { country: "uk" }, { country: "ca" }, { country: "jp" }];
}

export default async function AuditPage({ params }: Props) {
  const { country } = await params;
  if (!isValidCountry(country)) notFound();
  const data = getCountryData(country)!;
  return <RiskAudit countryData={data} countryCode={country} />;
}
