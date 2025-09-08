import { HydratedDocument } from 'mongoose';

import { IDivision } from '@/models';
import { resolveRef, listSanitizer, userSanitizer, workspaceSanitizer } from '@/utils/sanitizers';

/**
 * ----------------- Division -----------------
 */
export const divisionSanitizer = (division: IDivision | HydratedDocument<IDivision>) => ({
  id: String(division._id),
  name: division.name,
  description: division.description ?? null,
  image: division.image ?? null,
  workspace: resolveRef(division.workspace ?? null, workspaceSanitizer),
  createdBy: resolveRef(division.createdBy ?? null, userSanitizer),
  divisionRoles: division.divisionRoles ?? [],
});

export type SanitizedDivision = ReturnType<typeof divisionSanitizer>;

/**
 * ----------------- Division List -----------------
 * Can optionally select only specific fields
 */
export const allDivisionSanitizer = (
  divisions: IDivision[] | HydratedDocument<IDivision>[],
  fields?: (keyof SanitizedDivision)[]
) => ({
  divisions: listSanitizer(divisions, divisionSanitizer, fields),
});

export type SanitizedDivisions = ReturnType<typeof allDivisionSanitizer>;
