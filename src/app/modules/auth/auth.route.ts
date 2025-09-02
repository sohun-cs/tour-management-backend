import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { CheckAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";




const router = Router();


router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getRefreshToken);
router.post("/logout", AuthControllers.logout);
router.post("/reset-password", CheckAuth(...Object.values(Role)), AuthControllers.resetPassword)

export const AuthRouter = router;




