import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
};

export const signToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );