import { Router } from "express";
import { UserController } from "./user.controller";
import { validateSchema } from "../../middlewares/validation.request";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { CheckAuth } from "../../middlewares/check.auth";
import { Role } from "./user.interface";

const router = Router();


router.post("/register", validateSchema(createUserZodSchema), UserController.createUser);
router.get("/all-users", CheckAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers);
router.patch("/:id", validateSchema(updateUserZodSchema), CheckAuth(...Object.values(Role)), UserController.updatedUser);

export const UserRouter = router;