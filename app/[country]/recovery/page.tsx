import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountryData, isValidCountry } from "@/data";
import { RefusalRecovery } from "@/components/tools/refusal-recovery";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isValidCountry(country)) return {};
  const data = getCountryData(country);
  return {
    title: `${data!.name} Visa Refusal Recovery`,
    description: `Had a ${data!.name} visa refused? Get a structured analysis of your refusal reasons and a clear path to overturning it.`,
  };
}

export async function generateStaticParams() {
  return [{ country: "au" }, { country: "uk" }, { country: "ca" }, { country: "jp" }];
}

export default async function RecoveryPage({ params }: Props) {
  const { country } = await params;
  if (!isValidCountry(country)) notFound();
  const data = getCountryData(country)!;
  return <RefusalRecovery countryData={data} countryCode={country} />;
}
