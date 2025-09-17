export const verifyAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next(); // Allow access
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
