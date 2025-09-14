import { HydratedDocument } from 'mongoose';

import { IWorkspace } from '@/models/index.js';
import { resolveRef, listSanitizer, userSanitizer } from '@/sanitizers/index.js';

/**
 * ----------------- Workspace -----------------
 */
export const workspaceSanitizer = (workspace: IWorkspace | HydratedDocument<IWorkspace>) => ({
  id: String(workspace._id),
  name: workspace.name,
  description: workspace.description,
  createdBy: resolveRef(workspace.createdBy ?? null, userSanitizer),
  workspaceRoles: workspace.workspaceRoles,
});

export type SanitizedWorkspace = ReturnType<typeof workspaceSanitizer>;

/**
 * ----------------- Workspace List -----------------
 * Can optionally select only specific fields
 */
export const allWorkspaceSanitizer = (
  workspaces: IWorkspace[] | HydratedDocument<IWorkspace>[],
  fields?: (keyof SanitizedWorkspace)[]
) => ({
  workspaces: listSanitizer(workspaces, workspaceSanitizer, fields),
});

export type SanitizedWorkspaces = ReturnType<typeof allWorkspaceSanitizer>;
