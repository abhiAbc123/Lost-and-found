
import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized: No token provided" });

    const token = authHeader.split(" ")[1];

 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });

    
    req.user = decoded;

   
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
};


export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin)
    return res.status(403).json({ message: "Forbidden: Admins only" });
  next();
};