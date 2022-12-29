import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded as { _id: string; role: string };
  } catch (error) {
    return res.status(400).send({ message: "Invalid token." });
  }

  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .send({ message: "Only authorized users can access" });
  }
  next();
};
