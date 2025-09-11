import { HydratedDocument } from 'mongoose';
import { ICycle } from './cycle.model.js';
import {
  resolveRef,
  listSanitizer,
  workspaceSanitizer,
  divisionSanitizer,
} from '@/utils/sanitizers';

/**
 * ----------------- Cycle -----------------
 * Sanitizes a single cycle document for API responses.
 */
export const cycleSanitizer = (cycle: ICycle | HydratedDocument<ICycle>) => ({
  id: String(cycle._id),
  name: cycle.name,
  month: cycle.month,
  year: cycle.year,
  isClosed: cycle.isClosed,

  // Relations
  workspace: resolveRef(cycle.workspace ?? null, workspaceSanitizer),
  division: resolveRef(cycle.division ?? null, divisionSanitizer),

  createdAt: cycle.createdAt,
  updatedAt: cycle.updatedAt,
});

export type SanitizedCycle = ReturnType<typeof cycleSanitizer>;

/**
 * ----------------- Cycle List -----------------
 * Sanitizes a list of cycles with optional field selection.
 */
export const allCyclesSanitizer = (
  cycles: ICycle[] | HydratedDocument<ICycle>[],
  fields?: (keyof SanitizedCycle)[]
) => ({
  cycles: listSanitizer(cycles, cycleSanitizer, fields),
});

export type SanitizedCycles = ReturnType<typeof allCyclesSanitizer>;
