import { Router } from "express";
import { login } from "./../controllers/customerController";

export const customerRoutes: Router = Router();

customerRoutes.post("/login", login);
