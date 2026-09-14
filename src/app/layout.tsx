import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Plataforma de viagens", description: "Ambiente de desenvolvimento local" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><main>{children}</main></body></html>;
}

