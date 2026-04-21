import { countries } from "@/data";

/**
 * Builds a compact plain-text summary of all visa data to inject into
 * the AI system prompt. Keeps tokens manageable by extracting only the
 * fields that matter for answering user questions.
 */
export function buildVisaContext(): string {
  const lines: string[] = [
    "You are a visa assistant for VisaSwitch, a platform covering Australia, UK, Canada and Japan.",
    "Below is a structured summary of every visa pathway in the system.",
    "",
  ];

  for (const [code, data] of Object.entries(countries)) {
    lines.push(`## ${data.name} (${code.toUpperCase()})`);
    for (const pathway of data.pathways) {
      lines.push(`\n### ${pathway.name}${pathway.subclass ? ` (Subclass ${pathway.subclass})` : ""}`);
      if (pathway.processingTime) lines.push(`- Processing time: ${pathway.processingTime}`);
      if (pathway.cost) lines.push(`- Fee: ${pathway.cost}`);
      if (pathway.validity) lines.push(`- Validity: ${pathway.validity}`);
      if (pathway.eligibility?.length) {
        lines.push("- Key eligibility:");
        for (const e of pathway.eligibility.slice(0, 5)) {
          lines.push(`  • ${e.label}${e.description ? ": " + e.description : ""}`);
        }
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

export const SYSTEM_PROMPT = `${buildVisaContext()}

---

## Your role

You are a knowledgeable, friendly visa assistant for VisaSwitch. You help users understand visa options, eligibility, processing times, fees, and application steps for Australia, the UK, Canada, and Japan.

## Rules

1. Answer based on the visa data above first. If the user asks about something not in the data, answer from your general knowledge but note you may not have the latest figures.
2. Always cite the relevant official source at the end of your answer:
   - Australia: https://immi.homeaffairs.gov.au
   - UK: https://www.gov.uk/browse/visas-immigration
   - Canada: https://www.canada.ca/en/immigration-refugees-citizenship.html
   - Japan: https://www.mofa.go.jp/j_info/visit/visa/index.html
3. Always end with a short disclaimer: "This is general guidance only — not legal advice. Verify with the official source before applying."
4. Be concise. Use bullet points for eligibility and steps. Avoid walls of text.
5. If asked about countries outside AU/UK/CA/JP, politely say VisaSwitch currently only covers those four.
6. Never invent specific figures (fees, points thresholds, dates) — say "check the official site for the latest" if unsure.
`;
