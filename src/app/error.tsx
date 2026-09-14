"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <><h1>NÃ£o foi possÃ­vel carregar</h1><p>Verifique se os serviÃ§os locais estÃ£o funcionando.</p><button onClick={reset}>Tentar novamente</button></>;
}

