require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import cors from "cors";
import connectDB from "./utils/connectDB";
import userRoutes from "./routes/user.routes";
import classRoutes from "./routes/class.routes";
import adminRoutes from "./routes/admin.routes";
import { authorize } from "./middleware/authorize";

const app = express();

app.use(express.json());

declare module "express-serve-static-core" {
  interface Request {
    user: any;
  }
}

app.use(
  cors({
    origin: config.get<string>("origin"),
    credentials: true,
  })
);

const port = config.get<number>("port");

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  connectDB();
});

app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/admin", authorize, adminRoutes);

// other unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
