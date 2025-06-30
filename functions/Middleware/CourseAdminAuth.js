const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../Services/AppConfig"); // use same as login

const checkAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  const usertype = req.headers.usertype;

  if (!token) {
    return res.status(200).json({ error: "No token provided" });
  }

  if (usertype.toLowerCase().trim() !== "admin") {
    return res
      .status(200)
      .json({ error: "Access denied. Only Admins allowed." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // You can also check role from token if needed:
    if (decoded.role !== "admin") {
      return res.status(200).json({ error: "User is not an admin" });
    }

    req.user = decoded; // Attach decoded token to request object

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { checkAdminAuth };
