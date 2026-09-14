import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { acceptInvitation } from "./actions";
export default async function InvitePage({searchParams}:{searchParams:Promise<{token?:string}>}){const client=await serverSupabase();const {data}=await client.auth.getUser();const token=(await searchParams).token;if(!data.user)redirect(`/login?next=${encodeURIComponent(`/invite?token=${token??""}`)}`);return <><h1>Aceitar convite</h1><p>Confirme para ativar seu vínculo com a agência. O convite precisa corresponder ao e-mail desta sessão.</p><form action={acceptInvitation}><input type="hidden" name="token" value={token??""}/><button disabled={!token}>Aceitar convite</button></form></>}
