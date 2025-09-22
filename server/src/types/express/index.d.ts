import 'express';

import { IMembership, IDivisionMembership } from '@/models/index.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      role: string;
      email?: string;
      username?: string;
    };

    store?: {
      storeId: string;
    };

    membership?: {
      userId: string;
      storeId: string;
      storeRoles: string[];
    };

    cycle?: {
      cycleId: string;
      month: number;
      year: number;
      isClosed: boolean;
    };
  }
}
