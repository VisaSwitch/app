import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat-context";

export const runtime = "nodejs";
export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("Chat is not configured yet. Please try again later.", { status: 503 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const { messages, countryCode } = await req.json() as {
      messages: Message[];
      countryCode?: string;
    };

    if (!messages?.length) {
      return new Response("Missing messages", { status: 400 });
    }

    // ── Abuse guards ────────────────────────────────────────────────
    if (messages.length > 20) {
      return new Response("Session limit reached. Please start a new chat.", { status: 400 });
    }

    const lastMessage = messages.at(-1)?.content ?? "";
    if (lastMessage.length > 1000) {
      return new Response("Message too long. Please keep messages under 1,000 characters.", { status: 400 });
    }

    const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
    if (totalChars > 8000) {
      return new Response("Conversation too long. Please start a new chat.", { status: 400 });
    }
    // ────────────────────────────────────────────────────────────────

    const systemPrompt = buildSystemPrompt(countryCode);

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.slice(-12),
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    // Anthropic rate limit
    if (err instanceof Error && err.message.includes("rate_limit")) {
      return new Response("Too many requests right now — please wait a moment and try again.", { status: 429 });
    }
    // Anthropic spend cap hit
    if (err instanceof Error && err.message.includes("credit")) {
      return new Response("Chat is temporarily unavailable. Please try again later.", { status: 503 });
    }
    return new Response("Something went wrong. Please try again.", { status: 500 });
  }
}
