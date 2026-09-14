"use client";
import { useActionState } from "react";
import { createInvitation, type InvitationState } from "./actions";
export function InvitationForm({agencies}:{agencies:Array<{id:string;name:string}>}){
  const [state,action,pending]=useActionState<InvitationState,FormData>(createInvitation,{});
  return <form action={action}><label>Agência<select name="agencyId" required>{agencies.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label><label>E-mail<input type="email" name="email" required/></label><label>Papel<select name="memberRole"><option value="ANALYST">Analista</option><option value="ADMIN">Administrador</option></select></label><label>Validade em horas<input type="number" name="hours" min="1" max="168" defaultValue="24" required/></label><button disabled={pending}>{pending?"Criando…":"Criar convite"}</button>{state.error&&<p role="alert">{state.error}</p>}{state.token&&<p role="status">Token exibido uma única vez: <code>{state.token}</code></p>}</form>;
}
