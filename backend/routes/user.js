import express from "express";
import { loginUser, registerUser, verifyUser } from "../controller/user.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);


export default router;
