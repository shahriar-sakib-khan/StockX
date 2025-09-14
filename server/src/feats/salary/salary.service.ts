/**
 * @module salary.service
 *
 * @description Services for division member salary management,
 * including CRUD operations and recording payments with transactions.
 */

import { Types } from 'mongoose';

import { Errors } from '@/error/index.js';
import { Salary, salaryValidator, salarySanitizers } from '@/feats/salary/index.js';

/**
 * @function createSalary
 * @description Create a new division member salary
 *
 * @param {salaryValidator.CreateSalaryInput} salaryData - Salary creation data
 * @param {string} workspaceId - Workspace ID
 * @param {string} divisionId - Division ID
 * @param {string} memberId - Member ID
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<salarySanitizers.SanitizedSalary>} The created salary
 * @throws {Errors.BadRequestError} If a salary already exists for the member in this cycle
 */
export const createSalary = async (
  salaryData: salaryValidator.CreateSalaryInput,
  workspaceId: string,
  divisionId: string,
  memberId: string,
  cycleId: string
): Promise<salarySanitizers.SanitizedSalary> => {
  const { monthlySalary } = salaryData;

  // Ensure no duplicate salary exists for member in this cycle
  const existing = await Salary.exists({
    workspace: workspaceId,
    division: divisionId,
    member: memberId,
    cycle: cycleId,
  });
  if (existing)
    throw new Errors.BadRequestError('Salary already exists for this member in this cycle');

  const newSalary = await Salary.create({
    workspace: new Types.ObjectId(workspaceId),
    division: new Types.ObjectId(divisionId),
    member: new Types.ObjectId(memberId),
    cycle: new Types.ObjectId(cycleId),
    monthlySalary,
    paidAmount: 0,
    dueAmount: monthlySalary,
    isPaid: false,
  });

  return salarySanitizers.salarySanitizer(newSalary);
};

/**
 * @function getAllSalaries
 * @description Get all division member salaries
 *
 * @param {string} workspaceId - Workspace ID
 * @param {string} divisionId - Division ID
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Promise<salarySanitizers.SanitizedSalaries & { total: number }>} List of salaries and total count
 * @throws {Errors.NotFoundError} If no salaries are found
 */
export const getAllSalaries = async (
  workspaceId: string,
  divisionId: string,
  page: number,
  limit: number
): Promise<salarySanitizers.SanitizedSalaries & { total: number }> => {
  const total = await Salary.countDocuments({ workspace: workspaceId, division: divisionId });
  if (total === 0) return { salaries: [], total };

  const skip = (page - 1) * limit;
  const salaries = await Salary.find({ workspace: workspaceId, division: divisionId })
    .skip(skip)
    .limit(limit)
    .populate('cycle', 'name')
    .lean();

  return {
    salaries: salarySanitizers.allSalarySanitizer(salaries, ['cycle']).salaries,
    total,
  };
};

/**
 * @function getAllSalariesPerMember
 * @description Get all division member salaries per member
 *
 * @param {string} workspaceId - Workspace ID
 * @param {string} divisionId - Division ID
 * @param {string} memberId - Member ID
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Promise<salarySanitizers.SanitizedSalaries & { total: number }>} List of salaries and total count
 * @throws {Errors.NotFoundError} If no salaries are found
 */
export const getAllSalariesPerMember = async (
  workspaceId: string,
  divisionId: string,
  memberId: string,
  page: number,
  limit: number
): Promise<salarySanitizers.SanitizedSalaries & { total: number }> => {
  const total = await Salary.countDocuments({
    workspace: workspaceId,
    division: divisionId,
    member: memberId,
  });
  if (total === 0) return { salaries: [], total };

  const skip = (page - 1) * limit;
  const salaries = await Salary.find({
    workspace: workspaceId,
    division: divisionId,
    member: memberId,
  })
    .skip(skip)
    .limit(limit)
    .populate('cycle', 'name')
    .lean();

  return {
    salaries: salarySanitizers.allSalarySanitizer(salaries, [
      'cycle',
      'monthlySalary',
      'paidAmount',
      'dueAmount',
      'isPaid',
    ]).salaries,
    total,
  };
};

/**
 * @function getSingleSalary
 * @description Get details of a single division member salary
 *
 * @param {string} workspaceId - Workspace ID
 * @param {string} divisionId - Division ID
 * @param {string} salaryId - Salary ID
 * @returns {Promise<salarySanitizers.SanitizedSalary>} The salary details
 * @throws {Errors.NotFoundError} If the salary is not found
 */
export const getSingleSalary = async (
  workspaceId: string,
  divisionId: string,
  salaryId: string
): Promise<salarySanitizers.SanitizedSalary> => {
  const salary = await Salary.findOne({
    _id: salaryId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();
  if (!salary) throw new Errors.NotFoundError('Salary not found');

  return salarySanitizers.salarySanitizer(salary);
};

/**
 * @function updateSalary
 * @description Update a division member salary
 *
 * @param {salaryValidator.UpdateSalaryInput} updateData - The data to update the salary with
 * @param {string} workspaceId - Workspace ID
 * @param {string} divisionId - Division ID
 * @param {string} salaryId - Salary ID
 * @returns {Promise<salarySanitizers.SanitizedSalary>} The updated salary details
 * @throws {Errors.NotFoundError} If the salary is not found
 */
export const updateSalary = async (
  updateData: salaryValidator.UpdateSalaryInput,
  workspaceId: string,
  divisionId: string,
  salaryId: string
): Promise<salarySanitizers.SanitizedSalary> => {
  const { monthlySalary } = updateData;
  const salary = await Salary.findOneAndUpdate(
    {
      _id: salaryId,
      workspace: workspaceId,
      division: divisionId,
    },
    { monthlySalary },
    { new: true }
  ).lean();

  if (!salary) throw new Errors.NotFoundError('Salary not found');

  return salarySanitizers.salarySanitizer(salary);
};

/**
 * @function deleteSalary
 * @description Delete a division member salary
 *
 * @param {string} workspaceId - Workspace ID
 * @param {string} divisionId - Division ID
 * @param {string} salaryId - Salary ID
 * @returns {Promise<salarySanitizers.SanitizedSalary>} The deleted salary details
 * @throws {Errors.NotFoundError} If the salary is not found
 */
export const deleteSalary = async (
  workspaceId: string,
  divisionId: string,
  salaryId: string
): Promise<salarySanitizers.SanitizedSalary> => {
  const deleted = await Salary.findOneAndDelete({
    _id: salaryId,
    workspace: workspaceId,
    division: divisionId,
  }).lean();
  if (!deleted) throw new Errors.NotFoundError('Salary not found');

  return salarySanitizers.salarySanitizer(deleted);
};

/**
 * ----------------- Record Salary Payment -----------------
 */

// /**
//  * @function paySalary
//  * @description Record a payment for a division member salary
//  *
//  * @param {salaryValidator.PaySalaryInput} paymentData - The payment data
//  * @param {string} workspaceId - Workspace ID
//  * @param {string} divisionId - Division ID
//  * @param {string} salaryId - Salary ID
//  * @param {string} userId - User ID
//  * @returns {Promise<salarySanitizers.SanitizedSalary>} The updated salary details
//  */
// export const paySalary = async (
//   paymentData: { amount: number; paymentMethod?: string; ref?: string },
//   workspaceId: string,
//   divisionId: string,
//   salaryId: string,
//   userId?: string
// ): Promise<{
//   salary: salarySanitizers.SanitizedSalary;
//   transaction: transactionSanitizers.SanitizedTransaction;
// }> => {
//   const salary = await Salary.findOne({
//     _id: salaryId,
//     workspace: workspaceId,
//     division: divisionId,
//   });
//   if (!salary) throw new Errors.NotFoundError('Salary not found');

//   const { amount, paymentMethod, ref } = paymentData;

//   // Prevent overpayment
//   if (amount > salary.dueAmount) throw new Errors.BadRequestError('Payment exceeds due amount');

//   // Record the transaction
//   const tx = await transactionService.recordTransaction(userId!, workspaceId, divisionId, {
//     amount,
//     category: 'salary_payment',
//     paymentMethod,
//     counterpartyType: 'staff',
//     staffId: salary.member,
//     ref,
//   });

//   // Update salary
//   salary.paidAmount += amount;
//   salary.dueAmount -= amount;
//   salary.isPaid = salary.dueAmount <= 0;
//   await salary.save();

//   return {
//     salary: salarySanitizers.salarySanitizer(salary),
//     transaction: tx, // can sanitize in controller if needed
//   };
// };

/**
 * ----------------- Default Export (salaryService) -----------------
 */
export default {
  createSalary, // Create a new division member salary
  getSingleSalary, // Get details of a single division member salary
  getAllSalaries, // Get all division member salaries
  getAllSalariesPerMember, // Get all division member salaries per member
  updateSalary, // Update a division member salary
  deleteSalary, // Delete a division member salary
  // paySalary, // Record a payment for a division member salary
};
