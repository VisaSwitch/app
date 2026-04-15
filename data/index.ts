import { auData } from "./countries/au";
import { ukData } from "./countries/uk";
import { caData } from "./countries/ca";
import { jpData } from "./countries/jp";
import type { CountryCode, CountryData } from "@/types";

export const countries: Record<CountryCode, CountryData> = {
  au: auData,
  uk: ukData,
  ca: caData,
  jp: jpData,
};

export const countryList = [
  { code: "au" as CountryCode, name: "Australia", region: "Asia-Pacific" },
  { code: "uk" as CountryCode, name: "United Kingdom", region: "Europe" },
  { code: "ca" as CountryCode, name: "Canada", region: "North America" },
  { code: "jp" as CountryCode, name: "Japan", region: "Asia-Pacific" },
];

export function getCountryData(code: string): CountryData | null {
  return countries[code as CountryCode] ?? null;
}

export function isValidCountry(code: string): code is CountryCode {
  return code in countries;
}

export { auData, ukData, caData, jpData };
