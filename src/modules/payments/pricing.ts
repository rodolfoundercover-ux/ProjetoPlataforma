import { Money, splitInstallments } from './money';

export type FeeBearer = 'CLIENT' | 'AGENCY' | 'SHARED';
export type PaymentQuoteInput = {
  baseAmount: Money;
  providerFee: Money;
  feeBearer: FeeBearer;
  /** Required only for SHARED; its complement remains with the agency. */
  clientFee?: Money;
  installments: number;
};
export type PaymentQuote = {
  baseAmount: Money;
  providerFee: Money;
  clientFee: Money;
  agencyFee: Money;
  customerTotal: Money;
  installments: Money[];
};

/**
 * The gateway supplies the fee; this engine never invents a percentage.
 * Financial fee is deliberately kept outside the tourism revenue base.
 */
export function pricePayment(input: PaymentQuoteInput): PaymentQuote {
  let clientFee: Money;
  if (input.feeBearer === 'CLIENT') clientFee = input.providerFee;
  else if (input.feeBearer === 'AGENCY') clientFee = Money.zero();
  else {
    if (!input.clientFee || input.clientFee.greaterThan(input.providerFee)) throw new Error('Shared fee requires a valid client share');
    clientFee = input.clientFee;
  }
  const agencyFee = input.providerFee.minus(clientFee);
  const customerTotal = input.baseAmount.plus(clientFee);
  return { baseAmount: input.baseAmount, providerFee: input.providerFee, clientFee, agencyFee, customerTotal, installments: splitInstallments(customerTotal, input.installments) };
}
