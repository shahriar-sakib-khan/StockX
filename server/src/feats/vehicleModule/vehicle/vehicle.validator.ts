import { z } from 'zod';

export const createVehicleSchema = z
  .object({
    regNumber: z.string().min(1, 'Registration number is required').trim(),
    vehicleBrand: z.string().trim().optional(),
    vehicleModel: z.string().trim().optional(),
    image: z.string().url().optional().or(z.literal('')),
  })
  .strict();

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
