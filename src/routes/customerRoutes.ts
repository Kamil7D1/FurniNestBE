import { Router } from "express";
import { login, register } from "./../controllers/customerController";

export const customerRoutes: Router = Router();

customerRoutes.post("/login", login);
customerRoutes.post("/register", register);
