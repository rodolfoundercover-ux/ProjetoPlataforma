import { Money } from './money';

export type PaymentProviderName = 'MERCADO_PAGO' | 'INFINITE_PAY';
export type PaymentMethod = 'PIX' | 'CARD' | 'PAYMENT_LINK';
export type ProviderPayment = { providerPaymentId: string; checkoutUrl?: string; amount: Money; status: 'PENDING' | 'CONFIRMED' | 'REJECTED' };

export class PaymentProviderConfigurationError extends Error {
  constructor(public readonly provider: PaymentProviderName, reason: string) {
    super(`${provider}: ${reason}`);
    this.name = 'PaymentProviderConfigurationError';
  }
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createPayment(input: { accountReference: string; method: PaymentMethod; amount: Money; idempotencyKey: string }): Promise<ProviderPayment>;
  findPayment(input: { accountReference: string; providerPaymentId: string }): Promise<ProviderPayment | null>;
}

/** A production adapter is unavailable until its account reference and secret reference are configured. */
export class UnconfiguredPaymentProvider implements PaymentProvider {
  constructor(readonly name: PaymentProviderName, private readonly reason: string) {}
  async createPayment(): Promise<ProviderPayment> { throw new PaymentProviderConfigurationError(this.name, this.reason); }
  async findPayment(): Promise<ProviderPayment | null> { throw new PaymentProviderConfigurationError(this.name, this.reason); }
}

export function providerFromConfiguration(input: {
  provider: PaymentProviderName;
  accountReference?: string | null;
  credentialReference?: string | null;
  adapterAvailable: boolean;
}): PaymentProvider {
  if (!input.accountReference?.trim()) return new UnconfiguredPaymentProvider(input.provider, 'conta da agência não configurada');
  if (!input.credentialReference?.trim()) return new UnconfiguredPaymentProvider(input.provider, 'referência segura da credencial não configurada');
  if (!input.adapterAvailable) return new UnconfiguredPaymentProvider(input.provider, 'adapter real ainda não habilitado');
  return new UnconfiguredPaymentProvider(input.provider, 'adapter real exige configuração do ambiente');
}

/** Deterministic adapter restricted to controlled tests; it never reports confirmation. */
export class FakePaymentProvider implements PaymentProvider {
  readonly name: PaymentProviderName;
  private readonly entries = new Map<string, ProviderPayment>();
  constructor(name: PaymentProviderName = 'MERCADO_PAGO') { this.name = name; }
  async createPayment(input: { accountReference: string; method: PaymentMethod; amount: Money; idempotencyKey: string }): Promise<ProviderPayment> {
    const existing = this.entries.get(input.idempotencyKey);
    if (existing) return existing;
    const payment = { providerPaymentId: `fake_${input.idempotencyKey}`, amount: input.amount, status: 'PENDING' as const, checkoutUrl: input.method === 'PAYMENT_LINK' ? `https://fake.invalid/${input.idempotencyKey}` : undefined };
    this.entries.set(input.idempotencyKey, payment);
    return payment;
  }
  async findPayment(input: { accountReference: string; providerPaymentId: string }): Promise<ProviderPayment | null> {
    return [...this.entries.values()].find((payment) => payment.providerPaymentId === input.providerPaymentId) ?? null;
  }
}