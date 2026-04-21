import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chat-context";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const runtime = "nodejs";
export const maxDuration = 30;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, countryContext } = await req.json() as {
      messages: Message[];
      countryContext?: string;
    };

    if (!messages?.length) {
      return new Response("Missing messages", { status: 400 });
    }

    // Prepend country context to the system prompt if the user is on a country page
    const systemPrompt = countryContext
      ? `The user is currently viewing the ${countryContext} section of VisaSwitch.\n\n${SYSTEM_PROMPT}`
      : SYSTEM_PROMPT;

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.slice(-12), // last 12 messages to stay within context limits
    });

    // Stream the response as plain text chunks
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
