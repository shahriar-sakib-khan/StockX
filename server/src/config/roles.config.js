export const ROLES = ["user", "moderator", "admin"];

export const ROLE_PERMISSIONS = {
  user: ["read-self"],
  moderator: ["read-any", "edit-any"],
  admin: ["*"], // full access
};
// demo setup
