import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // ✅ Get token from cookies
  const token = req.cookies.accessToken;

  // ❌ If no token
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // ✅ Attach user info
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
