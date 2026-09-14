import { NextResponse } from "next/server";
import { logError } from "@/lib/observability";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) throw new Error("Configuration unavailable");
    const result = await fetch(new URL("/auth/v1/health", base), {
      cache: "no-store", signal: AbortSignal.timeout(3000),
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "" },
    });
    if (!result.ok) throw new Error("Dependency unavailable");
    return NextResponse.json({ status: "ok", auth: "reachable" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const requestId = logError("health", error);
    return NextResponse.json({ status: "unavailable", requestId }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

