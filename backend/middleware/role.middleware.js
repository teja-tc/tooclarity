// middlewares/authorizeRoles.js

/**
 * Role-based authorization middleware
 * @param {Array<string>} allowedRoles - roles that can access the route
 */
const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      console.error("[AuthorizeRoles] ❌ Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = authorizeRoles;
