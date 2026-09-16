/** Exact BRL money used by the domain. Provider adapters convert only at their boundary. */
export class Money {
  private constructor(readonly cents: bigint) {}

  static zero(): Money { return new Money(0n); }
  static fromDecimal(value: string): Money {
    const normalized = value.trim().replace(',', '.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) throw new Error('Invalid monetary value');
    const [whole, fraction = ''] = normalized.split('.');
    return new Money(BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2)));
  }
  static fromCents(cents: bigint): Money { return new Money(cents); }
  plus(other: Money): Money { return new Money(this.cents + other.cents); }
  minus(other: Money): Money {
    if (other.cents > this.cents) throw new Error('Money cannot be negative');
    return new Money(this.cents - other.cents);
  }
  isZero(): boolean { return this.cents === 0n; }
  greaterThan(other: Money): boolean { return this.cents > other.cents; }
  equals(other: Money): boolean { return this.cents === other.cents; }
  toDecimal(): string {
    const whole = this.cents / 100n;
    const fraction = (this.cents % 100n).toString().padStart(2, '0');
    return `${whole}.${fraction}`;
  }
}

/** Splits a total exactly; any residual cent is assigned to the final installment. */
export function splitInstallments(total: Money, count: number): Money[] {
  if (!Number.isInteger(count) || count < 1) throw new Error('Installment count must be positive');
  const divisor = BigInt(count);
  const base = total.cents / divisor;
  const residual = total.cents % divisor;
  return Array.from({ length: count }, (_, index) => Money.fromCents(base + (index === count - 1 ? residual : 0n)));
}
