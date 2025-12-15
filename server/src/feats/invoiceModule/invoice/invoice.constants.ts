export const InvoiceStatus = ['paid', 'partial', 'due', 'cancelled'] as const;
export type InvoiceStatusType = (typeof InvoiceStatus)[number];

export const ProductType = ['cylinder', 'gas', 'stove', 'regulator'] as const;
export type ProductTypeType = (typeof ProductType)[number];

export const SaleChannel = ['b2c_direct', 'b2b_delivery'] as const;
export type SaleChannelType = (typeof SaleChannel)[number];
