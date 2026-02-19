import { NextRequest } from "next/server";
import { CHAT_SYSTEM_PROMPT, CHAT_TOOLS } from "@/lib/chatPrompt";
import { searchPlaces, searchHotelRates, getHotelDetails } from "@/lib/liteapi";

const ZHIPU_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const ZHIPU_MODEL = "glm-4.5-flash";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 500;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

/** Strip special tokens and control sequences that could be used for injection */
function sanitizeContent(text: string): string {
  return text
    .replace(/<\|[^|]*\|>/g, "")
    .replace(/\[INST\]|\[\/INST\]/gi, "")
    .replace(/<<SYS>>|<<\/SYS>>/gi, "")
    .trim();
}

/** Strip markdown formatting that the model might still include */
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, "• ")
    .trim();
}

/** Parse [OPTIONS: A | B | C] from AI response, return clean text + options array */
function parseOptions(text: string): { content: string; options: string[] | null } {
  const match = text.match(/\[OPTIONS:\s*(.+?)\]\s*$/);
  if (!match) return { content: stripMarkdown(text), options: null };
  const options = match[1].split("|").map((o) => o.trim()).filter(Boolean);
  const content = stripMarkdown(text.slice(0, match.index).trim());
  return { content, options: options.length > 0 ? options : null };
}

interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface HotelResult {
  hotelId: string;
  name: string;
  starRating?: number;
  main_photo: string;
  minRate?: number;
  currency: string;
  reviewScore?: number;
  city: string;
  country: string;
  cancellationPolicy?: string;
}

/** Extract facilities list from hotel details */
function extractFacilities(details: Record<string, unknown>): string[] {
  const raw = (details.hotelFacilities as unknown[]) || (details.facilities as unknown[]) || [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((f) => (typeof f === "string" ? f : (f as { name?: string })?.name || ""))
    .filter(Boolean);
}

/* ─── execute search_hotels tool (resolves city → placeId internally) ─── */
async function executeSearch(
  args: Record<string, unknown>
): Promise<{ result: string; hotels: HotelResult[] }> {
  const destination = (args.destination as string) || "";
  const checkIn = args.checkIn as string;
  const checkOut = args.checkOut as string;
  const adults = (args.adults as number) || 2;
  const children = (args.children as number) || 0;
  const currency = (args.currency as string) || "USD";
  const starRating = args.starRating as number[] | undefined;

  // Step 1: Resolve destination to placeId
  const placesRes = await searchPlaces(destination);
  const places = placesRes?.data || [];
  if (places.length === 0) {
    return { result: `No destination found for "${destination}". Ask the user to try a different city name.`, hotels: [] };
  }
  const placeId = places[0].placeId;

  // Step 2: Search hotels with rates
  const searchParams: Record<string, unknown> = {
    checkin: checkIn,
    checkout: checkOut,
    adults,
    children,
    currency,
    guestNationality: "US",
    placeId,
    occupancies: [{ adults }],
    includeHotelData: true,
    timeout: 8,
    limit: 10,
  };
  if (starRating?.length) {
    searchParams.starRating = starRating;
  }

  const result = await searchHotelRates(searchParams as Parameters<typeof searchHotelRates>[0]);
  const ratesData = (result?.data || []) as Array<Record<string, unknown>>;

  if (ratesData.length === 0) {
    return { result: "No hotels found for these dates and criteria. Suggest the user try different dates or a nearby destination.", hotels: [] };
  }

  // Step 3: Always fetch hotel details (need facilities/amenities for AI knowledge)
  const ids = ratesData.map((h) => h.hotelId as string).slice(0, 5);
  const detailsMap = new Map<string, Record<string, unknown>>();
  const detailResults = await Promise.allSettled(ids.map((id) => getHotelDetails(id)));
  detailResults.forEach((res, i) => {
    if (res.status === "fulfilled" && res.value?.data) {
      detailsMap.set(ids[i], res.value.data);
    }
  });

  // Build hotel results with facilities
  const hasInline = ratesData[0].name || ratesData[0].hotelName;
  const hotelFacilitiesMap: Record<string, string[]> = {};

  const hotels: HotelResult[] = ratesData.slice(0, 5).map((hotel) => {
    const hId = hotel.hotelId as string;
    const fetched = detailsMap.get(hId) || {};
    const details = hasInline && !detailsMap.has(hId) ? hotel : fetched;

    // Extract facilities
    const facilities = extractFacilities(fetched);
    if (facilities.length > 0) {
      hotelFacilitiesMap[hId] = facilities;
    }

    const roomTypes = hotel.roomTypes as Array<{
      offerRetailRate?: { amount: number; currency: string };
      suggestedSellingPrice?: { amount: number; currency: string };
      rates?: Array<{
        retailRate?: { total?: Array<{ amount: number; currency: string }> };
        cancellationPolicies?: { refundableTag?: string };
      }>;
    }> | undefined;
    const room = roomTypes?.[0];
    const rate = room?.rates?.[0];
    const price = room?.offerRetailRate?.amount
      ?? room?.suggestedSellingPrice?.amount
      ?? rate?.retailRate?.total?.[0]?.amount;

    return {
      hotelId: hId,
      name: (details.name as string) || (details.hotelName as string) || "Hotel",
      starRating: details.starRating as number | undefined,
      main_photo: (details.main_photo as string) || (details.thumbnail as string) || "",
      minRate: typeof price === "number" && price > 0 ? price : undefined,
      currency: room?.offerRetailRate?.currency
        ?? rate?.retailRate?.total?.[0]?.currency
        ?? currency,
      reviewScore: (details.rating as number) ?? (details.reviewScore as number),
      city: (details.city as string) || "",
      country: (details.country as string) || "",
      cancellationPolicy: rate?.cancellationPolicies?.refundableTag,
    };
  });

  const priceRange = hotels.filter((h) => h.minRate).map((h) => h.minRate!);
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null;
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null;
  const cur = hotels[0]?.currency || "USD";

  const hotelNames = hotels.map((h) => h.name).filter((n) => n !== "Hotel");

  // Build detailed facility summary for the AI
  const facilitySummary = hotels
    .map((h) => {
      const facs = hotelFacilitiesMap[h.hotelId];
      if (!facs || facs.length === 0) return null;
      return `${h.name}: ${facs.join(", ")}`;
    })
    .filter(Boolean)
    .join("\n");

  return {
    result: `Found ${hotels.length} hotels in ${destination}. Price range: ${minPrice && maxPrice ? `${cur} ${minPrice.toFixed(0)}-${maxPrice.toFixed(0)}/night` : "varies"}. Hotel cards are shown automatically — just write a short enthusiastic intro. Then on the LAST line, add [OPTIONS: ${hotelNames.join(" | ")}] so the user can tap to ask about a specific hotel.\n\nHOTEL FACILITIES (use this to answer questions about amenities, parking, breakfast, pools, pets, WiFi, etc.):\n${facilitySummary || "Facility details not available for these hotels."}`,
    hotels,
  };
}

/* ─── call GLM ─── */
async function callGLM(
  messages: Array<{ role: string; content: string; tool_call_id?: string; tool_calls?: ToolCall[] }>,
  options?: { tools?: boolean }
) {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) throw new Error("ZHIPU_API_KEY not set");

  const body: Record<string, unknown> = {
    model: ZHIPU_MODEL,
    messages,
    stream: false,
    temperature: 0.7,
    max_tokens: 512,
  };

  // Only include tools when we want the AI to be able to call them
  if (options?.tools !== false) {
    body.tools = CHAT_TOOLS;
  }

  const res = await fetch(ZHIPU_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[chat] GLM error:", res.status, text);
    throw new Error(`GLM API error: ${res.status}`);
  }

  return res.json();
}

/* ─── POST handler ─── */
export async function POST(request: NextRequest) {
  try {
    const { messages: clientMessages } = await request.json();

    if (!clientMessages || !Array.isArray(clientMessages)) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (clientMessages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({
          content: "Our conversation is getting long! Please start a new chat so I can help you fresh. Just close and reopen the chat widget.",
          hotels: null,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const sanitizedMessages = clientMessages
      .filter((m: { role: string }) => ALLOWED_ROLES.has(m.role))
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: sanitizeContent(
          typeof m.content === "string"
            ? m.content.slice(0, MAX_MESSAGE_LENGTH)
            : ""
        ),
      }));

    const messages = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      ...sanitizedMessages,
    ];

    // Call 1: May return tool_calls or a direct text response
    const firstResponse = await callGLM(messages);
    const firstChoice = firstResponse.choices?.[0];

    if (!firstChoice) {
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const assistantMsg = firstChoice.message;

    // No tool calls → return text directly
    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
      const parsed = parseOptions(assistantMsg.content || "");
      return new Response(
        JSON.stringify({
          content: parsed.content,
          hotels: null,
          options: parsed.options,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Execute the tool call (only search_hotels is available now)
    const tc = assistantMsg.tool_calls[0] as ToolCall;
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(tc.function.arguments);
    } catch {
      args = {};
    }

    const { result: toolResult, hotels } = tc.function.name === "search_hotels"
      ? await executeSearch(args)
      : { result: "Unknown tool", hotels: [] as HotelResult[] };

    // Call 2: Send tool result back, get final response (no tools needed)
    const finalMessages = [
      ...messages,
      {
        role: "assistant",
        content: assistantMsg.content || "",
        tool_calls: assistantMsg.tool_calls,
      },
      {
        role: "tool",
        content: toolResult,
        tool_call_id: tc.id,
      },
    ];

    const secondResponse = await callGLM(finalMessages, { tools: false });
    const secondChoice = secondResponse.choices?.[0];
    const parsed = parseOptions(secondChoice?.message?.content || "Here are the hotels I found!");

    return new Response(
      JSON.stringify({
        content: parsed.content,
        hotels: hotels.length > 0 ? hotels : null,
        options: parsed.options,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[chat] Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
