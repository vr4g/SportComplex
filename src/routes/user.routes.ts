import { Router } from "express";
import * as userController from "../controllers/user.controller";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", authController.handleLogin);
router.get("/confirm/:id", userController.confirmEmail);

export default router;
