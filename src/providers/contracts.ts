// Contracts only. Provider adapters are implemented with their corresponding phases.
export interface ProviderContext { agencyId: string; requestId: string; idempotencyKey: string }
export interface NotificationProvider {
  send(context: ProviderContext, input: { recipient: string; templateId: string }): Promise<{ reference: string }>;
}
export interface PdfRenderer { render(document: Readonly<Record<string, unknown>>): Promise<Uint8Array> }
export interface SignatureProvider {
  request(context: ProviderContext, input: { documentId: string }): Promise<{ reference: string }>;
}

