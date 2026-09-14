"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <><h1>Não foi possível carregar</h1><p>Verifique se os serviços locais estão funcionando.</p><button onClick={reset}>Tentar novamente</button></>;
}

