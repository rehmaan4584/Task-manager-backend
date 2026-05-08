import { verifyJwt } from "../lib/jwt.js";

export const authMiddleware = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return res.status(401).json({ success: false, message: "Token required" });
  }
  const token = bearerToken.split(" ")[1];
  try {
    const decoded = await verifyJwt(token);
    // console.log('decoded',decoded);
    req.user = decoded;
    if (decoded) {
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    // Keep logs minimal to avoid spamming stack traces for auth failures.
    console.error("Token verification failed:", error?.message ?? error);
    return res.status(401).json({ success: false, message: "Token verification failed" });
  }
};
