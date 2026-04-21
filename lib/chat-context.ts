import { countries, countryList } from "@/data";
import type { CountryCode } from "@/types";

const OFFICIAL_SOURCES: Record<string, string> = {
  au: "https://immi.homeaffairs.gov.au",
  uk: "https://www.gov.uk/browse/visas-immigration",
  ca: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
  jp: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
};

const RULES = `
## Your role
You are a knowledgeable, friendly visa assistant for VisaSwitch. Help users understand visa options, eligibility, processing times, fees, and application steps.

## Rules
1. Answer from the visa data provided first. If a detail isn't in the data, use your general knowledge but flag it: "(verify on the official site — this may have changed)".
2. Always cite the relevant official source at the end:
   - Australia: https://immi.homeaffairs.gov.au
   - UK: https://www.gov.uk/browse/visas-immigration
   - Canada: https://www.canada.ca/en/immigration-refugees-citizenship.html
   - Japan: https://www.mofa.go.jp/j_info/visit/visa/index.html
3. End every answer with: "This is general guidance only — not legal advice. Always verify with the official source before applying."
4. Be concise. Use bullet points for eligibility and steps.
5. If asked about countries outside AU/UK/CA/JP, politely say VisaSwitch currently only covers those four.
6. Never invent specific figures (fees, points, dates) — say "check the official site for the latest" if unsure.
`;

/** Full detail for one country — used when user is on a country page (~700 tokens) */
function buildCountryContext(code: CountryCode): string {
  const data = countries[code];
  if (!data) return "";

  const lines: string[] = [
    `## ${data.name} (${code.toUpperCase()}) — full visa data`,
    `Official source: ${OFFICIAL_SOURCES[code]}`,
    "",
  ];

  for (const pathway of data.pathways) {
    lines.push(`### ${pathway.name}${pathway.subclass ? ` (Subclass ${pathway.subclass})` : ""}`);
    if (pathway.processingTime) lines.push(`- Processing time: ${pathway.processingTime}`);
    if (pathway.cost)           lines.push(`- Fee: ${pathway.cost}`);
    if (pathway.validity)       lines.push(`- Validity: ${pathway.validity}`);
    if (pathway.eligibility?.length) {
      lines.push("- Key eligibility:");
      for (const e of pathway.eligibility.slice(0, 5)) {
        lines.push(`  • ${e.label}${e.description ? ": " + e.description : ""}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

/** Brief index of all countries — used on general pages (~200 tokens) */
function buildGeneralContext(): string {
  const lines: string[] = [
    "## VisaSwitch covers these countries and visa types:",
    "",
  ];

  for (const { code, name } of countryList) {
    const data = countries[code];
    const visaNames = data.pathways.map((p) =>
      `${p.name}${p.subclass ? ` (${p.subclass})` : ""}`
    ).join(", ");
    lines.push(`**${name}**: ${visaNames}`);
    lines.push(`Official source: ${OFFICIAL_SOURCES[code]}`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Returns the full system prompt tailored to the current country context.
 * - On a country page: ~700 tokens (one country's full data)
 * - On a general page: ~200 tokens (brief index of all countries)
 * vs the old approach of ~3,000 tokens every time.
 */
export function buildSystemPrompt(countryCode?: string): string {
  const isValidCode = countryCode && countryCode in countries;

  const context = isValidCode
    ? buildCountryContext(countryCode as CountryCode)
    : buildGeneralContext();

  const focus = isValidCode
    ? `The user is currently viewing the ${countries[countryCode as CountryCode].name} section. Prioritise ${countries[countryCode as CountryCode].name} visa information in your answers, but answer questions about other countries too if asked.`
    : "The user is on a general page. Answer questions about any of the four countries.";

  return `${focus}\n\n${context}\n---\n${RULES}`;
}
