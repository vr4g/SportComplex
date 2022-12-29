import { Router } from "express";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.get("/classes", adminController.viewClasses);
router.post("/class", adminController.createClass);
router.post("/class/:id", adminController.editClass);
router.delete("/class/:id", adminController.deleteClass);
router.get("/users", adminController.showAllUsers);
router.post("/users/:id", adminController.manageUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/classes/rates_comments/:id", adminController.showRatesAndComments);

export default router;
