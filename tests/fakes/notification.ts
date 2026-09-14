import type { NotificationProvider, ProviderContext } from "../../src/providers/contracts";
export class FakeNotificationProvider implements NotificationProvider {
  readonly sent: { context: ProviderContext; templateId: string }[] = [];
  async send(context: ProviderContext, input: { recipient: string; templateId: string }) {
    const prior = this.sent.findIndex(item => item.context.agencyId === context.agencyId && item.context.idempotencyKey === context.idempotencyKey);
    if (prior >= 0) return { reference: "fake-" + prior };
    this.sent.push({ context: { ...context }, templateId: input.templateId });
    return { reference: "fake-" + (this.sent.length - 1) };
  }
}

