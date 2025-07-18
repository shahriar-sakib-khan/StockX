// middlewares/workspaceScope.js
import Membership from "../models/Membership.js";

export const workspaceAccess = (requiredRoles = []) => {
  return async (req, res, next) => {
    const { workspaceId } = req.params;

    // Shortcut for ostad
    if (req.user.superRole === "ostad") return next();

    const membership = await Membership.findOne({
      user: req.user._id,
      workspace: workspaceId,
    });

    if (!membership || membership.status !== "active") {
      return res.status(403).json({ message: "No access to this workspace" });
    }

    // Attach membership to request for later use
    req.membership = membership;

    // Role checking inside workspace
    if (requiredRoles.length && !requiredRoles.includes(membership.role)) {
      return res.status(403).json({ message: "Insufficient workspace role" });
    }

    next();
  };
};
