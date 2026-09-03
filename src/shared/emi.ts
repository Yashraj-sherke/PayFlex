export interface EmiCalculationInput {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
}

export function calculateEmi({
  principal,
  annualInterestRate,
  tenureMonths,
}: EmiCalculationInput): number {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new RangeError('Principal must be a positive number.');
  }

  if (!Number.isInteger(tenureMonths) || tenureMonths <= 0) {
    throw new RangeError('Tenure must be a positive whole number of months.');
  }

  if (!Number.isFinite(annualInterestRate) || annualInterestRate < 0) {
    throw new RangeError('Interest rate cannot be negative.');
  }

  if (annualInterestRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const compoundFactor = (1 + monthlyRate) ** tenureMonths;
  const monthlyPayment =
    (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);

  return Math.round(monthlyPayment);
}

export function calculateTotalPayable(
  monthlyPayment: number,
  tenureMonths: number,
  processingFee = 0,
): number {
  return monthlyPayment * tenureMonths + processingFee;
}
