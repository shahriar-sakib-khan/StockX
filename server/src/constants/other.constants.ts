/**
 * ----------------- Shared Constants -----------------
 */
export const SalaryCycles = ['daily', 'weekly', 'monthly', 'yearly'] as const;
export type SalaryCycleType = (typeof SalaryCycles)[number];

export const PaymentMethods = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE: 'mobile',
  DUE: 'due',
  OTHER: 'other',
} as const;
export type PaymentMethodType = (typeof PaymentMethods)[keyof typeof PaymentMethods];
