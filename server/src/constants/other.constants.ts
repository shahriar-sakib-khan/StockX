/**
 * ----------------- Shared Constants -----------------
 */
export const SalaryCycles = ['daily', 'weekly', 'monthly', 'yearly'] as const;
export type SalaryCycleType = (typeof SalaryCycles)[number];

export const PaymentMethods = ['cash', 'bank', 'mobile'] as const;
export type PaymentMethodType = (typeof PaymentMethods)[number];