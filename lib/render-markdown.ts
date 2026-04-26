// Server-side markdown → HTML renderer (shared by blog post pages)
// Supports: # headings, - bullet lists, 1. numbered lists, **bold**, [link](url), paragraphs

function inlineFormat(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="underline hover:opacity-70 transition-opacity" style="color:var(--primary)">$1</a>'
    );
}

export function renderMarkdown(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^#### (.+)/.test(line)) {
      closeList();
      out.push(
        `<h4 class="text-base font-semibold mt-6 mb-2" style="color:var(--foreground)">${inlineFormat(line.slice(5))}</h4>`
      );
    } else if (/^### (.+)/.test(line)) {
      closeList();
      out.push(
        `<h3 class="text-lg font-bold mt-8 mb-3" style="color:var(--foreground)">${inlineFormat(line.slice(4))}</h3>`
      );
    } else if (/^## (.+)/.test(line)) {
      closeList();
      out.push(
        `<h2 class="text-xl font-bold mt-10 mb-4" style="color:var(--foreground)">${inlineFormat(line.slice(3))}</h2>`
      );
    } else if (/^# (.+)/.test(line)) {
      closeList();
      out.push(
        `<h1 class="text-2xl font-bold mt-8 mb-4" style="color:var(--foreground)">${inlineFormat(line.slice(2))}</h1>`
      );
    } else if (/^[•\-\*] (.+)/.test(line)) {
      if (!inUl) {
        closeList();
        out.push(
          '<ul class="mt-3 mb-4 space-y-2 pl-5" style="color:var(--foreground)">'
        );
        inUl = true;
      }
      out.push(
        `<li class="list-disc leading-relaxed">${inlineFormat(line.replace(/^[•\-\*] /, ""))}</li>`
      );
    } else if (/^\d+\. (.+)/.test(line)) {
      if (!inOl) {
        closeList();
        out.push(
          '<ol class="mt-3 mb-4 space-y-2 pl-5" style="color:var(--foreground)">'
        );
        inOl = true;
      }
      out.push(
        `<li class="list-decimal leading-relaxed">${inlineFormat(line.replace(/^\d+\. /, ""))}</li>`
      );
    } else if (/^> (.+)/.test(line)) {
      closeList();
      out.push(
        `<blockquote class="border-l-4 pl-4 py-1 my-4 italic text-sm" style="border-color:var(--primary);color:var(--muted-foreground)">${inlineFormat(line.slice(2))}</blockquote>`
      );
    } else if (line.trim() === "---" || line.trim() === "***") {
      closeList();
      out.push(`<hr class="my-8" style="border-color:var(--border)" />`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      out.push(
        `<p class="mb-4 leading-relaxed" style="color:var(--foreground)">${inlineFormat(line)}</p>`
      );
    }
  }

  closeList();
  return out.join("\n");
}
