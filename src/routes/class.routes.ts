import { Router } from "express";
import * as classController from "../controllers/class.controller";

const router = Router();

router.get("/classes/:id", classController.classDetails);
router.post("/classes/:id", classController.rateSport);
router.post("/enroll_in_class/:id", classController.enrollInSport);
router.delete("/enroll_in_class/:id", classController.unEnrollInSport);
router.get("/filter", classController.filterClasses);

export default router;
