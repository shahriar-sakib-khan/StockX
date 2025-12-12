/**
 * ----------------- Exports from Staff (Identity + Profile) -----------------
 */
export {
  Staff,
  type IStaff,
  staffValidator,
  staffController,
  staffService,
  staffSanitizers,
} from './staff/index.js';

/**
 * ----------------- Exports from Salary (Logic) -----------------
 */
export {
  salaryValidator,
  salaryController,
  salaryService,
  salarySanitizers,
} from './salary/index.js';

/**
 * ----------------- Router Exports -----------------
 */
export { default as staffAuthRouter } from './staff.auth.routes.js';
export { default as staffRouter } from './staff.routes.js';
export { default as salaryRouter } from './salary.routes.js';
