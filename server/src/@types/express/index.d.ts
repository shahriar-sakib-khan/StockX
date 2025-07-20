// src/@types/express/index.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      role: string;
    };
    workspace?: {
      workspaceId: string;
      name: string;
    };
    membership?: {
      membershipId: string;
      role: string;
    };
  }
}
