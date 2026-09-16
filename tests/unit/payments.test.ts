import { describe, expect, it } from 'vitest';
import { Money, splitInstallments } from '../../src/modules/payments/money';
import { pricePayment } from '../../src/modules/payments/pricing';
import { FakePaymentProvider, PaymentProviderConfigurationError, providerFromConfiguration } from '../../src/modules/payments/providers';

describe('payment pricing', () => {
  it('keeps gateway fee separate from tourism revenue', () => {
    const quote = pricePayment({ baseAmount: Money.fromDecimal('1000.00'), providerFee: Money.fromDecimal('45.00'), feeBearer: 'CLIENT', installments: 1 });
    expect(quote.customerTotal.toDecimal()).toBe('1045.00');
    expect(quote.baseAmount.toDecimal()).toBe('1000.00');
    expect(quote.agencyFee.toDecimal()).toBe('0.00');
  });
  it('splits residual cents deterministically', () => {
    expect(splitInstallments(Money.fromDecimal('100.00'), 3).map((item) => item.toDecimal())).toEqual(['33.33', '33.33', '33.34']);
  });
  it('requires an explicit client share for a shared fee', () => {
    expect(() => pricePayment({ baseAmount: Money.fromDecimal('100.00'), providerFee: Money.fromDecimal('10.00'), feeBearer: 'SHARED', installments: 1 })).toThrow();
  });
  it('keeps the customer total unchanged when the agency pays the fee', () => {
    const quote = pricePayment({ baseAmount: Money.fromDecimal('1000.00'), providerFee: Money.fromDecimal('45.00'), feeBearer: 'AGENCY', installments: 2 });
    expect(quote.customerTotal.toDecimal()).toBe('1000.00');
    expect(quote.agencyFee.toDecimal()).toBe('45.00');
    expect(quote.installments.map((item) => item.toDecimal())).toEqual(['500.00', '500.00']);
  });
  it('splits a shared fee only according to the declared customer share', () => {
    const quote = pricePayment({ baseAmount: Money.fromDecimal('1000.00'), providerFee: Money.fromDecimal('45.00'), feeBearer: 'SHARED', clientFee: Money.fromDecimal('15.00'), installments: 1 });
    expect(quote.customerTotal.toDecimal()).toBe('1015.00');
    expect(quote.agencyFee.toDecimal()).toBe('30.00');
  });
});

describe('payment providers', () => {
  it('does not replace a missing provider credential with a fake checkout', async () => {
    const provider = providerFromConfiguration({ provider: 'MERCADO_PAGO', accountReference: 'agency-account', credentialReference: null, adapterAvailable: false });
    await expect(provider.createPayment({ accountReference: 'agency-account', method: 'PIX', amount: Money.fromDecimal('300.00'), idempotencyKey: 'payment-test-credential' }))
      .rejects.toBeInstanceOf(PaymentProviderConfigurationError);
  });
  it('creates an idempotent pending payment only in the controlled fake adapter', async () => {
    const provider = new FakePaymentProvider('INFINITE_PAY');
    const input = { accountReference: 'agency-test', method: 'PAYMENT_LINK' as const, amount: Money.fromDecimal('300.00'), idempotencyKey: 'payment-test-001' };
    const created = await provider.createPayment(input);
    const repeated = await provider.createPayment(input);
    const found = await provider.findPayment({ accountReference: input.accountReference, providerPaymentId: created.providerPaymentId });
    expect(repeated.providerPaymentId).toBe(created.providerPaymentId);
    expect(created.status).toBe('PENDING');
    expect(created.checkoutUrl).toContain('fake.invalid');
    expect(found?.amount.toDecimal()).toBe('300.00');
  });
});