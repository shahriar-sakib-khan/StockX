import { HydratedDocument } from 'mongoose';

import { Division } from '@/models';

export const getDivisionRoles = async (
  divisionId: string,
  page: number,
  limit: number
): Promise<{ name: string; permissions: string[] }[]> => {
  const skip: number = (page - 1) * limit;

  const divisionRoles = await Division.findById(divisionId)
    .skip(skip)
    .limit(limit)
    .select('defaultRoles')
    .select('customRoles');

  const allRoles = (divisionRoles?.defaultRoles ?? []).concat(divisionRoles?.customRoles ?? []);

  return allRoles;
};
export default { getDivisionRoles };
