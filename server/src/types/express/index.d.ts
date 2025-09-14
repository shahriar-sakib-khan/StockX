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

    workspace?: {
      workspaceId: string;
      name: string;
    };

    membership?: {
      user: string;
      workspace: string;
      workspaceRoles: string[];
    };

    divMembership?: {
      user: string;
      division: string;
      divisionRoles: string[];
    };

    cycle?: {
      cycleId: string;
      month: number;
      year: number;
      isClosed: boolean;
    };
  }
}
