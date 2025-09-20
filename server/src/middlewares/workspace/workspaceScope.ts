// import { Request, Response, NextFunction } from 'express';
// import { StatusCodes } from 'http-status-codes';

// import { assertAuth } from '@/common/assertions.js';
// import { Membership, Workspace } from '@/models/index.js';

// /**
//  * Middleware to enforce workspace-based access control
//  *
//  * @param allowedRoles - Roles allowed to access this route. Example: ['admin', 'manager']
//  * @throws {Error} If user is not authenticated
//  * @throws {Error} If user has no workspace membership
//  * @throws {Error} If user has multiple memberships
//  * @throws {Error} If workspace is not found
//  * @throws {Error} If membership is inactive
//  * @throws {Error} If user does not have the required role
//  */
// const workspaceScope =
//   (allowedRoles: string[] = []) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     // Ensure user is authenticated
//     assertAuth(req);
//     const { userId } = req.user;

//     if (!userId) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication missing.' });
//     }

//     // Ensure user is a member of a workspace
//     const memberships = await Membership.find({ user: userId }).lean();

//     if (memberships.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: 'User has no workspace membership.' });
//     }
//     // Ensure user has only one membership
//     if (memberships.length > 1) {
//       console.error(`Data integrity issue: User ${userId} has multiple memberships`, memberships);

//       return res.status(StatusCodes.CONFLICT).json({
//         message: 'Multiple memberships detected. Please contact support.',
//       });
//     }

//     const membership = memberships[0];

//     // Ensure workspace exists
//     const workspace = await Workspace.findById(membership.workspace).lean();

//     if (!workspace) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: 'Workspace not found.' });
//     }

//     // Ensure membership is active
//     if (membership.status !== 'active') {
//       return res
//         .status(StatusCodes.FORBIDDEN)
//         .json({ message: 'Access denied: inactive membership.' });
//     }

//     // Assign membership and roles to request
//     req.membership = {
//       userId,
//       workspaceId: membership.workspace.toString(),
//       workspaceRoles: membership.workspaceRoles,
//     };

//     // RBAC authorization check for allowed roles
//     if (allowedRoles.length > 0) {
//       const hasRole = membership.workspaceRoles.some(role => allowedRoles.includes(role));

//       if (!hasRole) {
//         return res
//           .status(StatusCodes.FORBIDDEN)
//           .json({ message: 'Access denied: insufficient role privileges.' });
//       }
//     }

//     next();
//   };

// export default workspaceScope;
