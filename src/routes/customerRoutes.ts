import { Router } from "express";
import {
  deleteCustomer,
  loginCustomer,
  registerCustomer,
  updateCustomer,
} from "./../controllers/customerController";

import { handleRefreshToken } from "./../controllers/refreshTokenControler";

export const customerRoutes: Router = Router();

customerRoutes.post("/login", loginCustomer);
customerRoutes.post("/register", registerCustomer);
customerRoutes.put("/:id", updateCustomer);
customerRoutes.delete("/:id", deleteCustomer);
customerRoutes.get("/refresh", handleRefreshToken);
