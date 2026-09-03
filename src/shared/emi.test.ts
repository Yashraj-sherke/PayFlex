import { describe, expect, it } from 'vitest';
import { calculateEmi, calculateTotalPayable } from './emi';

describe('calculateEmi', () => {
  it('calculates zero-interest EMI with whole-rupee rounding', () => {
    expect(
      calculateEmi({ principal: 127_400, annualInterestRate: 0, tenureMonths: 12 }),
    ).toBe(10_617);
  });

  it('uses the reducing-balance formula for an interest-bearing plan', () => {
    expect(
      calculateEmi({ principal: 127_400, annualInterestRate: 10.5, tenureMonths: 36 }),
    ).toBe(4_141);
  });

  it('includes a processing fee in the total payable', () => {
    expect(calculateTotalPayable(4_141, 36, 499)).toBe(149_575);
  });

  it.each([
    { principal: 0, annualInterestRate: 0, tenureMonths: 3 },
    { principal: 10_000, annualInterestRate: -1, tenureMonths: 3 },
    { principal: 10_000, annualInterestRate: 0, tenureMonths: 0 },
  ])('rejects invalid input: $principal/$annualInterestRate/$tenureMonths', (input) => {
    expect(() => calculateEmi(input)).toThrow(RangeError);
  });
});
