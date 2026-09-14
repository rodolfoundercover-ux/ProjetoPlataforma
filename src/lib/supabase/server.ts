import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import type { Database } from "@/lib/database.types";
const configSchema = z.object({ url: z.url(), key: z.string().min(1) });
export function supabaseConfig() {
  return configSchema.parse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
export async function serverSupabase() {
  const config = supabaseConfig();
  const jar = await cookies();
  return createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        // Server Components cannot write cookies. Proxy handles refresh there.
        try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch {}
      },
    },
  });
}
