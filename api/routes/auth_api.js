import express from "express";
const router = express.Router();

import * as auth from "../controllers/auth_api.js";

// registracijos užklausa
router.post("/register", auth.registerValidator(), auth.register);

// login užklausa
router.post("/login", auth.loginValidator(), auth.login);

export default router;