import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat-context";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const runtime = "nodejs";
export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, countryCode } = await req.json() as {
      messages: Message[];
      countryCode?: string;
    };

    if (!messages?.length) {
      return new Response("Missing messages", { status: 400 });
    }

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
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response("Something went wrong. Please try again.", { status: 500 });
  }
}
