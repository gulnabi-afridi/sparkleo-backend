import express from "express";
import { signup } from "../controllers/authController.js";
import { signin } from "../controllers/authController.js";

const router = express.Router();


// sign up api ------->
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
