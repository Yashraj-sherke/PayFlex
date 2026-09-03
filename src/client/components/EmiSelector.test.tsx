import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { EmiPlanDto } from '../../shared/types';
import { EmiSelector } from './EmiSelector';

const plans: EmiPlanDto[] = [
  {
    id: 'plan_6',
    tenureMonths: 6,
    interestRate: 0,
    cashbackAmount: 7_500,
    processingFee: 0,
    monthlyPayment: 21_233,
    totalPayable: 127_398,
  },
  {
    id: 'plan_12',
    tenureMonths: 12,
    interestRate: 0,
    cashbackAmount: 5_000,
    processingFee: 0,
    monthlyPayment: 10_617,
    totalPayable: 127_404,
  },
];

describe('EmiSelector', () => {
  it('allows a plan to be selected using its radio control', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <EmiSelector plans={plans} selectedPlanId="plan_6" onSelect={onSelect} />,
    );

    const twelveMonthPlan = screen.getByRole('radio', { name: /12 months/i });
    await user.click(twelveMonthPlan);

    expect(onSelect).toHaveBeenCalledWith('plan_12');
  });
});
